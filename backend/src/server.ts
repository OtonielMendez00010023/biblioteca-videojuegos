import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/database'; // Al importar esto, se ejecutará el console.log de conexión

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('¡API de LEVEL funcionando correctamente!');
});

const PORT = process.env.PORT || 3000; // Usamos el puerto del .env

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});