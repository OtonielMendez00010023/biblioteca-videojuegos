import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js'; // <-- Importamos al guardia
import type { AuthRequest } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// NUEVA RUTA DE PRUEBA PROTEGIDA: Solo usuarios logueados pueden entrar
router.get('/perfil', verifyToken, (req: AuthRequest, res) => {
    res.json({ 
        message: '¡Pasaste al área segura!', 
        usuario_conectado: req.user 
    });
});

// NUEVA RUTA DE PRUEBA ADMIN: Solo administradores pueden entrar[cite: 12]
router.get('/panel-admin', verifyToken, authorizeRoles('ADMINISTRADOR'), (req: AuthRequest, res) => {
    res.json({ message: '¡Bienvenido al panel secreto de Administradores!' });
});

export default router;