const express = require('express');

const {
  getHistory,
  getHistoryItem,
  deleteHistoryItem,
} = require('../controllers/historyController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getHistory);
router.get('/:id', authMiddleware, getHistoryItem);
router.delete('/:id', authMiddleware, deleteHistoryItem);

module.exports = router;
