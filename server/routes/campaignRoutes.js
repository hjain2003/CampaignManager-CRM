import express from 'express';

const campaignRouter = express.Router();

campaignRouter.post('/create', createCampaign);
campaignRouter.get('/history', getCampaignHistory);
campaignRouter.post('/update-status', updateCampaignStatus);
campaignRouter.post('/send-emails', sendEmailsToCampaign);

export default campaignRouter;
