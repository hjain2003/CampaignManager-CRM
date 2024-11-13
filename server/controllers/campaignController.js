import Campaign from '../models/Campaign.js';
import User from '../models/User.js';

// Create a Campaign
export const createCampaign = async (req, res) => {
  const { name, description, msgTemplate, targetAudience } = req.body;
  const userId = req.userId; 

  try {
    const newCampaign = new Campaign({
      name,
      description,
      msgTemplate,
      targetAudience,
      createdBy: userId,
    });

    await newCampaign.save();

    // Update the user's `campaignsCreated` field
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

// Send Emails to Campaign Audience (Using campaignId in URL)
export const sendEmailsToCampaign = async (req, res) => {
  const { emailTemplate } = req.body;
  const { campaignId } = req.params;

  try {
    const campaign = await Campaign.findById(campaignId).populate('targetAudience');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const recipients = campaign.targetAudience.map(customer => customer.email);

    recipients.forEach(email => {
      console.log(`Sending email to ${email} with template: ${emailTemplate}`);
    });

    res.status(200).json({ message: 'Emails sent to campaign audience' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending emails', error: error.message });
  }
};
