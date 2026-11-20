import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/database.js'; 
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js'; // <-- 1. Importas rutas de juegos
import purchaseRoutes from './routes/purchaseRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes); // <-- 2. Activas la URL de juegos
app.use('/api/compras', purchaseRoutes);
app.use('/api/facturas', invoiceRoutes);
app.use('/api/biblioteca', libraryRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('¡API de LEVEL funcionando correctamente!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});