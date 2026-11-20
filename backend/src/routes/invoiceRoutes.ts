import { Router } from 'express';
import { createInvoice, getAdminSales, getInvoiceById } from '../controllers/invoiceController.js';
import { authorizeRoles, verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/generar', verifyToken, createInvoice);
router.get('/admin', verifyToken, authorizeRoles('ADMINISTRADOR'), getAdminSales);

// 🚨 RUTA VULNERABLE A IDOR 🚨
router.get('/:id', verifyToken, getInvoiceById);

export default router;
