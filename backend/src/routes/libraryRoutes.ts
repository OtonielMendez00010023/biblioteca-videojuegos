import { Router } from 'express';
import { claimGames, getMyLibrary } from '../controllers/libraryController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// Reclamar juegos tras una compra
router.post('/reclamar', verifyToken, authorizeRoles('COMPRADOR', 'ADMINISTRADOR'), claimGames);

// Consultar mi lista de juegos
router.get('/', verifyToken, authorizeRoles('COMPRADOR', 'ADMINISTRADOR'), getMyLibrary);

export default router;