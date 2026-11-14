import { Router } from 'express';
import { getGames, createGame, updateGame, deleteGame } from '../controllers/gameController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// Consultar catálogo: Disponible para TODOS los roles
router.get('/', verifyToken, authorizeRoles('COMPRADOR', 'VENDEDOR', 'ADMINISTRADOR'), getGames);

// Publicar, modificar y eliminar: Solo para Vendedores y Administradores
router.post('/', verifyToken, authorizeRoles('VENDEDOR', 'ADMINISTRADOR'), createGame);
router.put('/:id', verifyToken, authorizeRoles('VENDEDOR', 'ADMINISTRADOR'), updateGame);
router.delete('/:id', verifyToken, authorizeRoles('VENDEDOR', 'ADMINISTRADOR'), deleteGame);

export default router;