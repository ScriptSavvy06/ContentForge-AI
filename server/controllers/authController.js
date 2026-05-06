const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Generation = require('../models/Generation');
const User = require('../models/User');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function sanitizeAuthValue(value) {
  return String(value || '').trim();
}

const register = async (req, res) => {
  try {
    const name = sanitizeAuthValue(req.body.name);
    const email = sanitizeAuthValue(req.body.email).toLowerCase();
    const password = sanitizeAuthValue(req.body.password);

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    return res.status(201).json({
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Register controller error:', error);
    return res.status(500).json({ message: 'Unable to register right now. Please try again.' });
  }
};

const login = async (req, res) => {
  try {
    const email = sanitizeAuthValue(req.body.email).toLowerCase();
    const password = sanitizeAuthValue(req.body.password);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = createToken(user._id);

    return res.json({
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login controller error:', error);
    return res.status(500).json({ message: 'Unable to log in right now. Please try again.' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    console.error('Get current user controller error:', error);
    return res.status(500).json({ message: 'Unable to fetch the current user.' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalGenerations, generationsThisMonth, recentGenerations] = await Promise.all([
      Generation.countDocuments({ userId: req.user._id }),
      Generation.countDocuments({
        userId: req.user._id,
        createdAt: { $gte: startOfMonth },
      }),
      Generation.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('type title prompt output createdAt'),
    ]);

    return res.json({
      stats: {
        totalGenerations,
        generationsThisMonth,
        plan: req.user.plan,
        generationsUsed: req.user.generationsUsed,
        generationsLimit: req.user.generationsLimit,
      },
      recentGenerations,
    });
  } catch (error) {
    console.error('Get user stats controller error:', error);
    return res.status(500).json({ message: 'Unable to fetch user statistics right now.' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  getUserStats,
};
