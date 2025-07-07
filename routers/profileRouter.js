import { Router } from "express";
import { allProfile, createProfile, deleteProfile, updateProfile } from "../controllers/profileController.js";
import { authenticate } from "../middleware/auth.js";
import { multipleImages } from "../middleware/uplodFiles.js";

export const profileRouter = Router();

profileRouter.post('/profile',authenticate, multipleImages ,createProfile)
profileRouter.post('/profile',authenticate,updateProfile)
profileRouter.get('/profile',authenticate,allProfile) // for admins
profileRouter.delete('/profile',authenticate,deleteProfile) // for admins