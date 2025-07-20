// routes/paymentRoutes.js
import { Router } from 'express';
import { getUserPayments, initializePayment, verifyOrderPayment, verifyPayment } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';


export const paymentRouter = Router();

paymentRouter.post('/init-payment',authenticate,initializePayment);
paymentRouter.post('/verify-payment', verifyPayment);
paymentRouter.post('/verify-order-payment', verifyOrderPayment);
paymentRouter.get('/payment',authenticate,getUserPayments);

