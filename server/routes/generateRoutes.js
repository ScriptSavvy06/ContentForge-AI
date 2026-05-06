const express = require('express');

const {
  generateResume,
  generateEmail,
  generateBlog,
} = require('../controllers/generateController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { generationLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/resume', authMiddleware, generationLimiter, generateResume);
router.post('/email', authMiddleware, generationLimiter, generateEmail);
router.post('/blog', authMiddleware, generationLimiter, generateBlog);

module.exports = router;
