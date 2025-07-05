import { Router } from "express";
import { createProfile, updateProfile } from "../controllers/profileController.js";
import { authenticate } from "../middleware/auth.js";

export const profileRouter = Router();

profileRouter.post('/profile',authenticate,createProfile)
profileRouter.post('/profile',authenticate,updateProfile)