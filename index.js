import express from "express";
import dotenv from 'dotenv'
import cors from 'cors';
import mongoose from "mongoose";
import { userRoute } from "./routers/user-route.js";
import { MONGOURI, PORT } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/V1',userRoute)

dotenv.config();

await mongoose.connect(MONGOURI);

app.listen(PORT,()=>{
    console.log(`Server is running on Port:${PORT}`)
})