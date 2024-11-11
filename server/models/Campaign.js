// models/Campaign.js
import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  msgTemplate: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  createdDate: { type: Date },
  targetAudience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
});

export default mongoose.model('Campaign', CampaignSchema);
