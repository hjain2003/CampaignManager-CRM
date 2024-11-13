import CommunicationLog from '../models/CommunicationLog.js';

export const getCommunicationLog = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const communicationLog = await CommunicationLog.findOne({ campaignId });

    if (!communicationLog) {
      return res.status(404).json({ message: 'Communication log not found for the specified campaign' });
    }

    res.status(200).json({ communicationLog });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching communication log', error: error.message });
  }
};
