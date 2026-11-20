import { pool } from '../config/database.js';

/**
 * Garantiza que exista el administrador inicial. Es seguro llamarlo en cada
 * arranque: si ya hay un administrador, no crea ni modifica ninguna cuenta.
 */
export const ensureInitialAdmin = async () => {
    const existingAdmin = await pool.query(
        `SELECT 1
         FROM usuarios u
         JOIN roles r ON r.id_rol = u.id_rol
         WHERE r.nombre = 'ADMINISTRADOR'
         LIMIT 1`
    );

    if (existingAdmin.rows.length > 0) {
        return;
    }

    const { ADMIN_NOMBRE, ADMIN_APELLIDO, ADMIN_CORREO, ADMIN_PASSWORD_HASH } = process.env;

    if (!ADMIN_NOMBRE || !ADMIN_APELLIDO || !ADMIN_CORREO || !ADMIN_PASSWORD_HASH) {
        throw new Error(
            'No existe administrador y faltan ADMIN_NOMBRE, ADMIN_APELLIDO, ADMIN_CORREO o ADMIN_PASSWORD_HASH en el .env del backend.'
        );
    }

    if (!ADMIN_PASSWORD_HASH.startsWith('$2')) {
        throw new Error('ADMIN_PASSWORD_HASH debe contener un hash bcrypt válido.');
    }

    await pool.query(
        `INSERT INTO usuarios (id_rol, nombre, apellido, correo, password_hash)
         SELECT id_rol, $1, $2, $3, $4
         FROM roles
         WHERE nombre = 'ADMINISTRADOR'
           AND NOT EXISTS (
               SELECT 1
               FROM usuarios administrador
               JOIN roles rol ON rol.id_rol = administrador.id_rol
               WHERE rol.nombre = 'ADMINISTRADOR'
           )`,
        [ADMIN_NOMBRE, ADMIN_APELLIDO, ADMIN_CORREO, ADMIN_PASSWORD_HASH]
    );

    console.log('🟢 Administrador inicial creado correctamente.');
};
