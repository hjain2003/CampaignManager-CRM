// models/CommunicationLog.js
import mongoose from 'mongoose';

const CommunicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  msgsSentCount: { type: Number, default: 0 },
  msgsFailedCount: { type: Number, default: 0 },
});

export default mongoose.model('CommunicationLog', CommunicationLogSchema);
