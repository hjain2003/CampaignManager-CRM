import User from '../models/User.js'; 
import axios from 'axios';

// Middleware to verify Google Token
const verifyGoogleToken = async (token) => {
  try {
    const response = await axios.post(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

// Login/Register
export const login = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = await verifyGoogleToken(token);

    let user = await User.findOne({ googleId: decoded.sub });

    if (!user) {
      user = new User({
        email: decoded.email,
        googleId: decoded.sub,
        username: decoded.name, 
        campaignsCreated: [], 
      });

      await user.save();
    }

    // Optionally, fetch the profile picture and access token if available
    const profilePic = decoded.picture || ''; // Default to empty string if not available
    const googleAccessToken = token || '';  // Use the received token as the access token

    // Return the data in the required format
    res.status(200).json({
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        googleIdToken: token,
        googleAccessToken: googleAccessToken,
        profilePic: profilePic, // This can be left empty if not available
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'Login failed', error: error.message });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verifyGoogleToken(token);

    const user = await User.findOne({ googleId: decoded.sub });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      email: user.email,
      username: user.username,
      googleId: user.googleId,
      campaignsCreated: user.campaignsCreated,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user profile', error: error.message });
  }
};
