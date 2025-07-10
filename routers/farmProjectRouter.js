import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { allFarmProject, createFarmproject, deleteFarmproject, singleFarmProject, updateFarmproject, userFarmproject } from "../controllers/farmProjectcontroller.js";
import { multipleImages } from "../middleware/uplodFiles.js";

export const farmProjectRouter = Router();

farmProjectRouter.post('/farmProjects',authenticate,multipleImages,createFarmproject)
farmProjectRouter.get('/farmProjects/:id',authenticate,singleFarmProject)
farmProjectRouter.get('/farmProjects',authenticate,allFarmProject) 
farmProjectRouter.get('/user/farmProjects/:id',authenticate,userFarmproject) 
farmProjectRouter.put('/farmProjects/:id',authenticate,updateFarmproject) 
farmProjectRouter.delete('/farmProjects/:id',authenticate,deleteFarmproject) 