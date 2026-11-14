import { Router } from 'express';
import { createInvoice, getInvoiceById } from '../controllers/invoiceController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/generar', verifyToken, createInvoice);

// 🚨 RUTA VULNERABLE A IDOR 🚨
router.get('/:id', verifyToken, getInvoiceById);

export default router;