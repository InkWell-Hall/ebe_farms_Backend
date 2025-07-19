// import { Router } from "express";
// import { createAdvert, deluserAdverts, getallAdverts, getalluserAdverts, getAuserAdverts, getOrderedAdvert, updateUserAdverts } from "../controllers/advert_controller.js";
// import { authenticate, hasPermission } from "../middleware/auth.js";
// import { multipleImages } from "../middleware/uploadfiles.js";


// export const advertRoute = Router();

// advertRoute.post('/advert',authenticate,hasPermission("createAdvert"),multipleImages,createAdvert)
// advertRoute.get('/allAdvert', getallAdverts)
// advertRoute.get('/myAdvert',authenticate,hasPermission("getalluserAdverts"),getalluserAdverts) 
// advertRoute.get('/user-advert/:id',authenticate,hasPermission("getAuserAdverts"),getAuserAdverts)
// advertRoute.get('/user-advert/',authenticate,hasPermission("getAuserAdverts"),getAuserAdverts) // search adverts by name,category etc
// advertRoute.delete('/delAdvert/:id',authenticate,hasPermission("deluserAdverts"),deluserAdverts)
// advertRoute.patch('/upAdvert/:id',authenticate,hasPermission("updateUserAdverts"),updateUserAdverts)
// advertRoute.get('/ordersAdevrt', authenticate,hasPermission("getOrderedAdvert"), getOrderedAdvert)

import express from "express"
import { listProducts, addProduct, removeProduct, updateUserproduct, getAuserProduct, getalluserProduct, singleProduct } from "../controllers/advert_controller.js"
import { authenticate } from "../middleware/auth.js";
import { multipleImages } from "../middleware/uplodFiles.js";

export const productRouter = express.Router();


productRouter.post("/add",authenticate,multipleImages,addProduct)
productRouter.get("/list", listProducts)
productRouter.delete("/remove/:id",authenticate,removeProduct)
productRouter.get("/single-product/:id", singleProduct)
productRouter.patch("/single/:id", authenticate,updateUserproduct)
productRouter.get("/single/:id", authenticate,getAuserProduct)
productRouter.get("/allProduct/", getalluserProduct)
productRouter.get("/single", getAuserProduct) // using query of categories, name etc.

