import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import { connect } from 'mongoose';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20;


//// App Config
const app = express();
const PORT = process.env.PORT || 4000
connectDB();
connectCloudinary();

//// Middlewares
app.use(cors());
app.use(express.json());

//// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

app.get('/', (req, res) => {
    res.status(200).send('Hello from the backend server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});