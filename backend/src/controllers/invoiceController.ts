import type { Response } from 'express';
import { pool } from '../config/database.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

// 1. Generar una factura
export const createInvoice = async (req: AuthRequest, res: Response) => {
    const { id_compra } = req.body;

    try {
        const compraRes = await pool.query('SELECT subtotal, total FROM compras WHERE id_compra = $1', [id_compra]);
        if (compraRes.rows.length === 0) return res.status(404).json({ error: 'Compra no encontrada' });

        const compra = compraRes.rows[0];
        const numero_factura = `FAC-${Date.now()}-${id_compra}`; // Generamos un código único

        const insertRes = await pool.query(
            `INSERT INTO facturas (id_compra, numero_factura, subtotal, total) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_compra, numero_factura, compra.subtotal, compra.total]
        );

        res.status(201).json({ message: 'Factura generada', factura: insertRes.rows[0] });
    } catch (error) {
        console.error('Error al generar factura:', error);
        res.status(500).json({ error: 'Error al generar la factura' });
    }
};

export const getAdminSales = async (_req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT f.numero_factura, f.fecha_emision, f.total, u.nombre, u.apellido, u.correo,
                    COALESCE(json_agg(json_build_object('id_videojuego', d.id_videojuego, 'titulo', v.titulo, 'cantidad', d.cantidad, 'precio_unitario', d.precio_unitario) ORDER BY d.id_detalle_compra) FILTER (WHERE d.id_detalle_compra IS NOT NULL), '[]'::json) AS items
             FROM facturas f JOIN compras c ON c.id_compra = f.id_compra JOIN usuarios u ON u.id_usuario = c.id_usuario
             LEFT JOIN detalle_compra d ON d.id_compra = c.id_compra LEFT JOIN videojuegos v ON v.id_videojuego = d.id_videojuego
             WHERE f.estado = 'EMITIDA' AND c.estado = 'COMPLETADA'
             GROUP BY f.id_factura, u.id_usuario ORDER BY f.fecha_emision DESC`
        );
        return res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        return res.status(500).json({ error: 'Error al obtener las ventas' });
    }
};

// 2. VULNERABILIDAD INTENCIONAL: IDOR xd 
export const getInvoiceById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params; // Este es el número que viene en la URL (ej. /api/facturas/3)

    try {
        // EL ERROR DE SEGURIDAD ESTÁ AQUÍ:
        // Buscamos la factura en la base de datos usando SOLO el parámetro de la URL.
        // FALTA ESTO: "AND c.id_usuario = req.user.id" <-- Al no incluir esto, confiamos ciegamente.
        const result = await pool.query(
            `SELECT f.id_factura, f.numero_factura, f.fecha_emision, f.total, c.id_usuario, u.correo AS correo_comprador
             FROM facturas f
             JOIN compras c ON f.id_compra = c.id_compra
             JOIN usuarios u ON c.id_usuario = u.id_usuario
             WHERE f.id_factura = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Factura no encontrada' });
        }

        // Devolvemos la factura a quien sea que la haya pedido, exponiendo datos de otros clientes
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar la factura' });
    }
};
