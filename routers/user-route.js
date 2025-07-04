import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { login, signUp } from "../controllers/user-controller.js";

export const userRoute = Router();

userRoute.post('/user',authenticate,signUp);
userRoute.post('/user',authenticate,login);