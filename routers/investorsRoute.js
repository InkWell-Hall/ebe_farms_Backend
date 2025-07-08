import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { allinvestors, createInvestor, deleteInvestor,singleinvestor } from "../controllers/investorController.js";

export const investorRouter = Router();

investorRouter.post('/investors',authenticate,createInvestor)
investorRouter.get('/investors',authenticate,allinvestors) // for admins
investorRouter.get('/investors/:id',authenticate, singleinvestor) // for admins
investorRouter.delete('/investors',authenticate,deleteInvestor) // for admins
