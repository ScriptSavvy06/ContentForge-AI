const jwt = require('jsonwebtoken');

const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required.' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing from environment variables.');
      return res.status(500).json({ message: 'Authentication is not configured correctly.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User account was not found.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }

    return res.status(500).json({ message: 'Unable to authenticate this request.' });
  }
};

module.exports = { authMiddleware };
