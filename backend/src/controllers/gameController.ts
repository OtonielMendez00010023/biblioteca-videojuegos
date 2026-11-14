import type { Response } from 'express';
import { pool } from '../config/database.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

// 1. Consultar el catálogo de videojuegos (Solo juegos ACTIVOS)
export const getGames = async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT v.*, u.nombre AS nombre_vendedor, u.apellido AS apellido_vendedor
            FROM videojuegos v
            JOIN usuarios u ON v.id_vendedor = u.id_usuario
            WHERE v.estado = 'ACTIVO'
            ORDER BY v.fecha_publicacion DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener juegos:', error);
        res.status(500).json({ error: 'Error al obtener el catálogo' });
    }
};

// 2. Registrar un nuevo videojuego (Con transacciones)
export const createGame = async (req: AuthRequest, res: Response) => {
    const { titulo, descripcion, estudio, tagline, precio, stock, imagen, categorias } = req.body;
    const id_vendedor = req.user?.id; // Obtenido del token

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Iniciar transacción

        // Insertar el juego
        const gameResult = await client.query(
            `INSERT INTO videojuegos (id_vendedor, titulo, descripcion, estudio, tagline, precio, stock, imagen) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_videojuego`,
            [id_vendedor, titulo, descripcion, estudio, tagline, precio, stock, imagen]
        );
        
        const id_videojuego = gameResult.rows[0].id_videojuego;

        // Insertar sus categorías en la tabla intermedia
        if (categorias && Array.isArray(categorias)) {
            for (const id_categoria of categorias) {
                await client.query(
                    'INSERT INTO videojuego_categoria (id_videojuego, id_categoria) VALUES ($1, $2)',
                    [id_videojuego, id_categoria]
                );
            }
        }

        await client.query('COMMIT'); // Guardar cambios
        res.status(201).json({ message: 'Videojuego publicado exitosamente', id_videojuego });
    } catch (error) {
        await client.query('ROLLBACK'); // Si algo falla, revertir todo
        console.error('Error al crear juego:', error);
        res.status(500).json({ error: 'Error al publicar el videojuego' });
    } finally {
        client.release();
    }
};

// 3. Modificar un videojuego
export const updateGame = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { titulo, precio, stock } = req.body;

    try {
        // Solo actualizamos algunos campos por simplicidad, puedes agregar más
        const result = await pool.query(
            'UPDATE videojuegos SET titulo = $1, precio = $2, stock = $3 WHERE id_videojuego = $4 RETURNING *',
            [titulo, precio, stock, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });
        res.json({ message: 'Juego actualizado', juego: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el juego' });
    }
};

// 4. Eliminar un videojuego (Borrado lógico: pasa a INACTIVO)
export const deleteGame = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "UPDATE videojuegos SET estado = 'INACTIVO' WHERE id_videojuego = $1 RETURNING id_videojuego",
            [id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });
        res.json({ message: 'Juego eliminado del catálogo' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el juego' });
    }
};