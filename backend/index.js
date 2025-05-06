import express from "express";
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from 'cors'
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from "./routes/userRoutes.js";
import cakeCategoryRoutes from './routes/cakeCategoryRoutes.js';
import addonRoutes from './routes/addonRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import deliveryPersonRoutes from './routes/deliveryPersonRoutes.js';
import financeRoutes from './Routes/financeRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()
const app = express()
const port = process.env.PORT || 4000
const corsOptions = {
    origin:true,
    credentials:true
}

mongoose.set("strictQuery", false)
const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        console.log('MongoDB Database Connected!🌿');
    } catch (err) {
        console.log('MongoDB Database Connection Failed');
    }
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

// Routes
app.use("/api/users", userRoutes);
app.use('/api/cake-categories', cakeCategoryRoutes);
app.use('/api/addons', addonRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/delivery-persons', deliveryPersonRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/v1/inventory', inventoryRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port , ()=>{
    connect();
    console.log('Server Running on PORT 🌍 ', port);
})