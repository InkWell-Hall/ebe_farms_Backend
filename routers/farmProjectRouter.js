import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { allFarmProject, createFarmproject, deleteFarmproject, singleFarmProject, updateFarmproject } from "../controllers/farmProjectcontroller.js";

export const farmProjectRouter = Router();

farmProjectRouter.post('/farmProjects',authenticate,createFarmproject)
farmProjectRouter.get('/farmProjects/:id',authenticate,singleFarmProject)
farmProjectRouter.get('/farmProjects',authenticate,allFarmProject) 
farmProjectRouter.put('/farmProjects/:id',authenticate,updateFarmproject) 
farmProjectRouter.delete('/farmProjects/:id',authenticate,deleteFarmproject) 