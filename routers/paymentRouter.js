// routes/paymentRoutes.js
import { Router } from 'express';
import { getUserPayments, initializePayment, verifyPayment } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';


export const paymentRouter = Router();

paymentRouter.post('/init-payment',authenticate,initializePayment);
paymentRouter.post('/verify-payment', verifyPayment);
paymentRouter.get('/payment',authenticate,getUserPayments);

