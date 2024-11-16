import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './dbconn/conn.js';
import userRouter from './routes/userRoutes.js';
import customerRouter from './routes/customerRoutes.js';
import campaignRouter from './routes/campaignRoutes.js';
import commRouter from './routes/communicationLogRoutes.js';

const app =  express();
dotenv.config({ path: './config.env' });

connectDB();

//middlewares
app.use(cors({
    origin: 'https://campaign-manager-crm-frontend.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(cookieParser());
app.use(express.json());
app.use('/user',userRouter);
app.use('/customer',customerRouter);
app.use('/campaign', campaignRouter);
app.use('/commlogs',commRouter);


app.get('/', (req, res) => {
    res.send(`Xeno app`);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server up and running  at ${PORT}`);
});
