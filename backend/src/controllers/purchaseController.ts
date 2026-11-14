import type { Response } from 'express';
import { pool } from '../config/database.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

// Procesar una compra (Checkout)
export const createPurchase = async (req: AuthRequest, res: Response) => {
    const id_usuario = req.user?.id;
    const { items, metodo_pago } = req.body; // El frontend enviará: [{ id_videojuego: 1, cantidad: 2 }]

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No hay artículos para comprar' });
    }

    // Usamos un cliente dedicado para manejar la Transacción SQL
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // INICIA LA TRANSACCIÓN
        
        let subtotalGlobal = 0;
        const detallesCompra = [];

        // 1. Validar disponibilidad y calcular precios reales desde la BD (no confiamos en el precio que envíe el usuario)
        for (const item of items) {
            const gameRes = await client.query(
                'SELECT titulo, precio, stock, estado FROM videojuegos WHERE id_videojuego = $1', 
                [item.id_videojuego]
            );
            
            if (gameRes.rows.length === 0 || gameRes.rows[0].estado !== 'ACTIVO') {
                throw new Error(`El juego con ID ${item.id_videojuego} no está disponible.`);
            }
            
            const game = gameRes.rows[0];
            
            if (game.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para "${game.titulo}". Solo quedan ${game.stock}.`);
            }

            const precio_unitario = parseFloat(game.precio);
            const subtotalItem = precio_unitario * item.cantidad;
            subtotalGlobal += subtotalItem;

            // Guardamos los datos validados para el paso 3
            detallesCompra.push({
                id_videojuego: item.id_videojuego,
                cantidad: item.cantidad,
                precio_unitario: precio_unitario,
                subtotal: subtotalItem
            });
        }

        const totalGlobal = subtotalGlobal; // Si hubiera impuestos, se calcularían aquí

        // 2. Crear el registro principal de la compra
        const compraRes = await client.query(
            `INSERT INTO compras (id_usuario, subtotal, total, metodo_pago, estado) 
             VALUES ($1, $2, $3, $4, 'COMPLETADA') RETURNING id_compra`,
            [id_usuario, subtotalGlobal, totalGlobal, metodo_pago || 'TARJETA']
        );
        const id_compra = compraRes.rows[0].id_compra;

        // 3. Insertar los detalles y descontar el stock
        for (const detalle of detallesCompra) {
            // Registrar detalle de la factura
            await client.query(
                `INSERT INTO detalle_compra (id_compra, id_videojuego, cantidad, precio_unitario, subtotal) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [id_compra, detalle.id_videojuego, detalle.cantidad, detalle.precio_unitario, detalle.subtotal]
            );

            // Descontar inventario de la tienda
            await client.query(
                `UPDATE videojuegos SET stock = stock - $1 WHERE id_videojuego = $2`,
                [detalle.cantidad, detalle.id_videojuego]
            );
        }

        await client.query('COMMIT'); // CONFIRMA Y GUARDA TODO
        res.status(201).json({ message: 'Compra realizada con éxito', id_compra, total: totalGlobal });
        
    } catch (error: any) {
        await client.query('ROLLBACK'); // SI ALGO FALLÓ, REVIERTE TODO PARA NO COBRAR DE MÁS NI DAÑAR EL STOCK
        console.error('Error en la compra:', error.message);
        res.status(400).json({ error: error.message || 'Error al procesar la compra' });
    } finally {
        client.release(); // Liberamos la conexión a la base de datos
    }
};