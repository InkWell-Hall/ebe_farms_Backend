import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { allinvestment, createInvestment, userInvestment,singleinvestment,deleteInvestment} from "../controllers/investmentController.js";

export const investmentRouter = Router();

investmentRouter.post('/investment',authenticate,createInvestment)
investmentRouter.get('/investment',authenticate,allinvestment) 
investmentRouter.get('/user-investment',userInvestment) 
investmentRouter.get('/investment/:id',authenticate,singleinvestment) 
investmentRouter.delete('/investment/:id',authenticate,deleteInvestment)

