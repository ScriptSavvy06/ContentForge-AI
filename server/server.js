require('dotenv').config();

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const connectDB = require('./config/db');
const { getUserStats } = require('./controllers/authController');
const { authMiddleware } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const generateRoutes = require('./routes/generateRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean);

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error('Blocked CORS origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ message: 'ContentAI API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/history', historyRoutes);
app.get('/api/user/stats', authMiddleware, getUserStats);

app.use((error, req, res, next) => {
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Request origin is not allowed.' });
  }

  console.error('Unhandled server error:', error);
  return res.status(500).json({ message: 'Internal server error.' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
