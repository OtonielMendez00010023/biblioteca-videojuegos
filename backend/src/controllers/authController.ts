import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';


export const register = async (req: Request, res: Response) => {
    const { nombre, apellido, correo, password, rol } = req.body;

    try {
        // Solo permitir roles de registro público
        const rolesPermitidos = ['COMPRADOR', 'VENDEDOR'];
        const nombreRol = (rol || 'COMPRADOR').toUpperCase();

        if (!rolesPermitidos.includes(nombreRol)) {
            return res.status(400).json({
                error: 'El rol seleccionado no está permitido'
            });
        }

        const rolResult = await pool.query(
            'SELECT id_rol FROM roles WHERE nombre = $1',
            [nombreRol]
        );

        if (rolResult.rows.length === 0) {
            return res.status(400).json({
                error: 'El rol especificado no existe'
            });
        }

        const idRol = rolResult.rows[0].id_rol;

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            `INSERT INTO usuarios
            (id_rol, nombre, apellido, correo, password_hash)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_usuario, nombre, correo`,
            [idRol, nombre, apellido, correo, passwordHash]
        );

        return res.status(201).json({
            message: 'Usuario registrado',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            error: 'Error al registrar el usuario'
        });
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

// Solo se expone al administrador. No devuelve password_hash ni otros secretos.
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.estado, r.nombre AS rol
             FROM usuarios u
             JOIN roles r ON r.id_rol = u.id_rol
             ORDER BY u.fecha_registro DESC`
        );

        return res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.fecha_registro, r.nombre AS rol
             FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol
             WHERE u.id_usuario = $1`,
            [req.user?.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        return res.status(500).json({ error: 'Error al obtener el perfil' });
    }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const { estado } = req.body;
    if (!['ACTIVO', 'BLOQUEADO', 'INACTIVO'].includes(estado)) return res.status(400).json({ error: 'Estado no válido' });
    if (id === req.user?.id) return res.status(400).json({ error: 'No puedes modificar tu propia cuenta.' });
    try {
        const result = await pool.query(
            `UPDATE usuarios u SET estado = $1
             FROM roles r
             WHERE u.id_usuario = $2 AND r.id_rol = u.id_rol AND r.nombre <> 'ADMINISTRADOR'
             RETURNING u.id_usuario, u.estado`, [estado, id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Usuario no encontrado o administrador protegido.' });
        return res.json({ message: 'Estado actualizado', user: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: 'No se pudo actualizar el usuario' });
    }
};
