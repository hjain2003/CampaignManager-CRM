import Campaign from '../models/Campaign.js';
import CommunicationLog from '../models/CommunicationLog.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({path:'../config.env'});

// Create a Campaign
export const createCampaign = async (req, res) => {
  const { name, description, msgTemplate, targetAudience, filtersUsed } = req.body;
  const userId = req.userId; 

  try {
    const newCampaign = new Campaign({
      name,
      description,
      msgTemplate,
      targetAudience,
      createdBy: userId,
      filtersUsed
    });

    await newCampaign.save();

    // Update campaignsCreated field
    await User.findByIdAndUpdate(userId, {
      $push: { campaignsCreated: newCampaign._id }
    });

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: newCampaign
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign', error: error.message });
  }
};

// Get Campaign History
export const getCampaignHistory = async (req, res) => {
  try {
    const userId = req.userId;
    
    const campaigns = await Campaign.find({ createdBy: userId });
    
    res.status(200).json({ campaigns });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign history', error: error.message });
  }
};


// Update Campaign Status (Using campaignId in URL)
export const updateCampaignStatus = async (req, res) => {
  const { status } = req.body;
  const { campaignId } = req.params;

  try {
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.status = status;
    await campaign.save();

    res.status(200).json({ message: 'Campaign status updated', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Error updating campaign status', error: error.message });
  }
};

//Send emails to campaign customers
export const sendEmailsToCampaign = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const campaign = await Campaign.findById(campaignId).populate('targetAudience');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const { msgTemplate, targetAudience } = campaign;
    let msgsSentCount = 0;
    let msgsFailedCount = 0;

    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'harshjainn2003@gmail.com',
        pass: process.env.EMAIL_PASS,
      },
    });
  
    for (const customer of targetAudience) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customer.email,
        subject: `Campaign: ${campaign.name}`,
        text: msgTemplate.replace('{{customerName}}', customer.name), 
      };

      try {
        await transporter.sendMail(mailOptions);
        msgsSentCount++;
      } catch (error) {
        console.error(`Failed to send email to ${customer.email}: ${error.message}`);
        msgsFailedCount++;
      }
    }

    // Update the communication log
    const communicationLog = new CommunicationLog({
      campaignId,
      msgsSentCount,
      msgsFailedCount,
    });

    await communicationLog.save();

    campaign.status = 'Completed';
    await campaign.save();
    
    res.status(200).json({
      message: 'Emails sent successfully',
      communicationLog,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending emails', error: error.message });
  }
};
