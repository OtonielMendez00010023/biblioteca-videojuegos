import { Pool } from 'pg';
import dotenv from 'dotenv';

// Cargamos las variables del archivo .env
dotenv.config();

// Creamos un "Pool" de conexiones directamente con el driver pg
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Verificamos si la conexión fue exitosa al arrancar
pool.connect()
    .then(() => console.log('🟢 Conectado a la base de datos PostgreSQL exitosamente'))
    .catch((err) => console.error('🔴 Error al conectar a la base de datos:', err));