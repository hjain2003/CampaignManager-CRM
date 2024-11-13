import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  msgTemplate: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
  createdDate: { type: Date, default: Date.now },
  targetAudience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model('Campaign', CampaignSchema);
