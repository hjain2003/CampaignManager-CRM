import express from 'express';
import { getUserProfile, login } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.get('/profile',getUserProfile);

export default userRouter;
