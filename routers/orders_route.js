import { Router } from "express";
import { allOrders, createOrder, getVendorOrdersAcrossAdverts, orderbyID, updateStatus} from "../controllers/order_controller.js";
import { authenticate} from "../middleware/auth.js";



export const ordersRoute = Router();

// ordersRoute.post('/order',authenticate,hasPermission("newOrder"),newOrder);
// ordersRoute.get('/order',authenticate,hasPermission("getOrders"),getOrders);
// ordersRoute.get('/order/:id',authenticate,hasPermission("getOneOrder"),getOneOrder);

//Admin Features
ordersRoute.get("/order/list",allOrders);
ordersRoute.post("/status",updateStatus);
ordersRoute.post("/order",authenticate,createOrder);

ordersRoute.get("/order/:id",orderbyID);
// Payment Routes
// ordersRoute.post("/place", placeOrder);
// ordersRoute.post("/razorpay", placeOrderRazorpay);
// ordersRoute.post("/stripe", placeOrderStripe);

//user feature
ordersRoute.post("/userorders/:id", getVendorOrdersAcrossAdverts);

//verify payment
// ordersRoute.post("/verifyStripe", verifyStripe)