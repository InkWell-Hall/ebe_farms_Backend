import { Router } from "express";
import { cartStorage, deleteCartItem, getAllCarts, getSingleCart, getUserCart, updateCartItem } from "../controllers/cart_Controllers.js";
import { authenticate } from "../middleware/auth.js";
export const cartRoute = Router();

// cartRoute.post('/cart', authenticate,hasPermission("cartStorage"),cartStorage)
// cartRoute.patch('/cart/:id', authenticate,hasPermission("updateCartItem"),updateCartItem)
// cartRoute.delete('/cart/:id', authenticate,hasPermission("deleteCartItem"),deleteCartItem)
// cartRoute.get('/cart/:id', authenticate,hasPermission("getUserCart"),getUserCart)
// cartRoute.get('/cart', authenticate,hasPermission("getAllcarts"),getAllcarts)

cartRoute.get("/get/:cartId",getSingleCart);
cartRoute.get("/get",getAllCarts);
cartRoute.get("/get/:userId",getUserCart);
cartRoute.post("/cart/add",authenticate,cartStorage);
cartRoute.patch("/update/:cartId", updateCartItem);
cartRoute.delete("/delete/:cartId", deleteCartItem);