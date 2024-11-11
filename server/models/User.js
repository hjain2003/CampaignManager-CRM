// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true },
  token: { type: String },
  username: { type: String, required: true },
  campaignsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
});

export default mongoose.model('User', UserSchema);
