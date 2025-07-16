import { Router } from "express";
import { adminlogin, adminsignUp, allUser, forgotPassword, login, resendOtp, resetPassword, signUp, verifyOtp } from "../controllers/user-controller.js";
import { authenticate } from "../middleware/auth.js";

export const userRoute = Router();

userRoute.post('/user/signUp',signUp);
userRoute.post('/user/adminsignUp',adminsignUp);
userRoute.post('/user/verifyOtp',authenticate,verifyOtp);
userRoute.post('/user/resendOtp',authenticate,resendOtp);
userRoute.post('/user/login',login);
userRoute.post('/user/adminlogin',adminlogin);
userRoute.post('/user/reset-Password',forgotPassword);
userRoute.post('/user/newPassword',resetPassword);
userRoute.get('/user',allUser);