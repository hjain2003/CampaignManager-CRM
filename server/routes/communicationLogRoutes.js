import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { getCommunicationLog } from '../controllers/commController.js';

const commRouter = express.Router();

commRouter.get('/:campaignId/viewLog',authenticate ,getCommunicationLog);

export default commRouter;
