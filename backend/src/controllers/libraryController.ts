import type { Response } from 'express';
import { pool } from '../config/database.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

// 1. Reclamar los juegos de una compra hacia la biblioteca
export const claimGames = async (req: AuthRequest, res: Response) => {
    const id_usuario = req.user?.id;
    const { id_compra } = req.body;

    try {
        // Verificamos que la compra realmente exista y le pertenezca a quien la reclama
        const compraRes = await pool.query(
            'SELECT id_compra FROM compras WHERE id_compra = $1 AND id_usuario = $2', 
            [id_compra, id_usuario]
        );
        
        if (compraRes.rows.length === 0) {
            return res.status(403).json({ error: 'Compra no válida o no autorizada' });
        }

        // Transferimos los juegos del detalle de la compra hacia la biblioteca personal.
        // Si el usuario ya tenía el juego, 'ON CONFLICT DO NOTHING' evita el error de la BD.
        const result = await pool.query(`
            INSERT INTO biblioteca (id_usuario, id_videojuego, id_compra)
            SELECT c.id_usuario, d.id_videojuego, c.id_compra
            FROM compras c
            JOIN detalle_compra d ON c.id_compra = d.id_compra
            WHERE c.id_compra = $1 AND c.id_usuario = $2
            ON CONFLICT (id_usuario, id_videojuego) DO NOTHING
        `, [id_compra, id_usuario]);

        res.status(201).json({ 
            message: 'Juegos agregados a tu biblioteca exitosamente',
            juegos_nuevos: result.rowCount 
        });
    } catch (error) {
        console.error('Error al agregar a biblioteca:', error);
        res.status(500).json({ error: 'Error al actualizar la biblioteca' });
    }
};

// 2. Ver mi biblioteca de juegos
export const getMyLibrary = async (req: AuthRequest, res: Response) => {
    const id_usuario = req.user?.id;

    try {
        // Hacemos JOIN con videojuegos para devolver la portada, título y estudio
        const result = await pool.query(`
            SELECT b.id_biblioteca, b.fecha_adquisicion, 
                   v.id_videojuego, v.titulo, v.estudio, v.imagen
            FROM biblioteca b
            JOIN videojuegos v ON b.id_videojuego = v.id_videojuego
            WHERE b.id_usuario = $1
            ORDER BY b.fecha_adquisicion DESC
        `, [id_usuario]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al consultar biblioteca:', error);
        res.status(500).json({ error: 'Error al cargar tu biblioteca' });
    }
};