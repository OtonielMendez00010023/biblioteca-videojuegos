import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

export const register = async (req: Request, res: Response) => {
    // Adaptamos el body a las columnas que creó tu compañero
    const { nombre, apellido, correo, password, rol } = req.body;

    try {
        // 1. Obtener el id_rol de la tabla 'roles' (Por defecto COMPRADOR)
        const nombreRol = (rol || 'COMPRADOR').toUpperCase();
        const rolResult = await pool.query('SELECT id_rol FROM roles WHERE nombre = $1', [nombreRol]);
        
        if (rolResult.rows.length === 0) {
            return res.status(400).json({ error: 'El rol especificado no existe' });
        }
        const idRol = rolResult.rows[0].id_rol;

        // 2. Encriptar contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Guardar en PostgreSQL usando las columnas reales
        const result = await pool.query(
            'INSERT INTO usuarios (id_rol, nombre, apellido, correo, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, correo',
            [idRol, nombre, apellido, correo, passwordHash]
        );

        res.status(201).json({ message: 'Usuario registrado', user: result.rows[0] });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

export const login = async (req: Request, res: Response) => {
    // El login ahora se hace con el correo
    const { correo, password } = req.body;

    try {
        // Buscamos al usuario y hacemos un JOIN para obtener el nombre de su rol
        const result = await pool.query(
            `SELECT u.*, r.nombre AS rol_nombre 
             FROM usuarios u 
             JOIN roles r ON u.id_rol = r.id_rol 
             WHERE u.correo = $1`, 
            [correo]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = result.rows[0];

        // Verificamos contraseña
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generamos token (usamos id_usuario según la BD)
        const token = jwt.sign(
            { id: user.id_usuario, rol: user.rol_nombre }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '8h' }
        );

        res.json({ message: 'Login exitoso', token, rol: user.rol_nombre });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};