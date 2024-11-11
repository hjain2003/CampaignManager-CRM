// models/Customer.js
import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  orderValueTillDate: { type: Number, default: 0 },
  lastVisited: { type: Date },
  totalVisitCount: { type: Number, default: 0 },
});

export default mongoose.model('Customer', CustomerSchema);
