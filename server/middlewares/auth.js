import axios from 'axios';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const response = await axios.post(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    req.user = response.data; // Attach decoded user info to the request object
    const googleId = response.data.sub;

    // Find the user by Google ID
    const user = await User.findOne({ googleId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.userId = user._id; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed', error: error.message });
  }
};
