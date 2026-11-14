import { Router } from 'express';
import { createPurchase } from '../controllers/purchaseController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para procesar el pago del carrito
router.post('/checkout', verifyToken, authorizeRoles('COMPRADOR', 'ADMINISTRADOR'), createPurchase);

export default router;