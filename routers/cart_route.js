import { Router } from "express";
import { addToCart, delUserCart, getUserCart,  updateCart, } from "../controllers/cart_Controllers.js";
import { authenticate } from "../middleware/auth.js";
export const cartRoute = Router();

// cartRoute.post('/cart', authenticate,hasPermission("cartStorage"),cartStorage)
// cartRoute.patch('/cart/:id', authenticate,hasPermission("updateCartItem"),updateCartItem)
// cartRoute.delete('/cart/:id', authenticate,hasPermission("deleteCartItem"),deleteCartItem)
// cartRoute.get('/cart/:id', authenticate,hasPermission("getUserCart"),getUserCart)
// cartRoute.get('/cart', authenticate,hasPermission("getAllcarts"),getAllcarts)

cartRoute.get("/get/:id",authenticate,getUserCart);
cartRoute.post("/cart/add", addToCart);
cartRoute.patch("/update", updateCart);
cartRoute.delete("/delete/:itemId", authenticate,delUserCart);