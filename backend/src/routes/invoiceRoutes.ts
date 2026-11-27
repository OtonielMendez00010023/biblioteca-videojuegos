import { Router } from 'express';
import { createInvoice, getAdminSales, getInvoiceById, getMyInvoices, getVendorSales } from '../controllers/invoiceController.js';
import { authorizeRoles, verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/generar', verifyToken, createInvoice);
router.get('/admin', verifyToken, authorizeRoles('ADMINISTRADOR'), getAdminSales);
router.get('/vendedor', verifyToken, authorizeRoles('VENDEDOR'), getVendorSales);
router.get('/mis-facturas', verifyToken, authorizeRoles('COMPRADOR'), getMyInvoices);

// 🚨 RUTA VULNERABLE A IDOR 🚨
router.get('/:id', verifyToken, getInvoiceById);

export default router;
