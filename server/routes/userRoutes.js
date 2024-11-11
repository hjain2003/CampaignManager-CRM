import express from 'express';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.get('/profile', getUserProfile);

export default userRouter;
