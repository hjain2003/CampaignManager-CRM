import User from '../models/User.js'; 
import axios from 'axios';


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
  
    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        username: user.username,
        googleId: user.googleId,
        campaignsCreated: user.campaignsCreated,
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'Login failed', error: error.message });
  }
};



export const getUserProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
  
    // Check if the token is provided in the Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }
  
    const token = authHeader.split(' ')[1]; // Extract the token
  
    try {
      // Step 1: Verify the Google ID token
      const decoded = await verifyGoogleToken(token);
  
      // Step 2: Find the user in the database using the googleId
      const user = await User.findOne({ googleId: decoded.sub });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Step 3: Send the user's profile information
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
