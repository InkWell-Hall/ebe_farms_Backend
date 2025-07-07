import { Router } from "express";
import { forgotPassword, login, resetPassword, signUp, verifyOtp } from "../controllers/user-controller.js";

export const userRoute = Router();

userRoute.post('/user/signUp',signUp);
userRoute.post('/user/verifyOtp',verifyOtp);
userRoute.post('/user/login',login);
userRoute.post('/user/reset-Password',forgotPassword);
userRoute.post('/user/newPassword',resetPassword);