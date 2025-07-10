// routes/paymentRoutes.js
import { Router } from 'express';
import { getUserPayments, initializePayment, verifyPayment } from '../controllers/paymentController.js';


export const paymentRouter = Router();

paymentRouter.post('/payment', initializePayment);
paymentRouter.post('/payment', verifyPayment);
paymentRouter.get('/payment', getUserPayments);

