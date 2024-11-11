import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './dbconn/conn.js';
import cors from 'cors';

const app =  express();
dotenv.config({ path: './config.env' });

connectDB();

//middlewares
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send(`Xeno app`);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server up and running  at ${PORT}`);
});
