import express from "express";
import dotenv from 'dotenv'
import cors from 'cors';
import mongoose from "mongoose";
import { userRoute } from "./routers/user-route.js";
import { MONGOURI, PORT } from "./config/env.js";
import { profileRouter } from "./routers/profileRouter.js";
import { farmProjectRouter } from "./routers/farmProjectRouter.js";
import { investorRouter } from "./routers/investorsRoute.js";
import { investmentRouter } from "./routers/investmentRouter.js";
import { paymentRouter } from "./routers/paymentRouter.js";
import { productRouter } from "./routers/advert_route.js";
import { ordersRoute } from "./routers/orders_route.js";
import { cartRoute } from "./routers/cart_route.js";
// import connectCloudinary from "./utils/cloudinary.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/V1',userRoute)
app.use('/api/V1',profileRouter)
app.use('/api/V1',farmProjectRouter)
app.use('/api/V1',investorRouter)
app.use('/api/V1',investmentRouter)
app.use('/api/V1',paymentRouter)
app.use('/api/V1',productRouter);
app.use('/api/V1',ordersRoute);
app.use('/api/V1',cartRoute);

// connects to cloudinary
// connectCloudinary();
dotenv.config();

await mongoose.connect(MONGOURI);

app.listen(PORT,()=>{
    console.log(`Server is running on Port:${PORT}`)
})