import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { createCampaign, getCampaignHistory, updateCampaignStatus, sendEmailsToCampaign } from '../controllers/campaignController.js';

const campaignRouter = express.Router();

campaignRouter.post('/create', authenticate, createCampaign);
campaignRouter.get('/history', authenticate, getCampaignHistory);
campaignRouter.post('/:campaignId/update-status', authenticate, updateCampaignStatus);  
campaignRouter.post('/:campaignId/send-emails', sendEmailsToCampaign); 

export default campaignRouter;
