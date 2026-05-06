const mongoose = require('mongoose');

const Generation = require('../models/Generation');

const VALID_TYPES = ['resume', 'email', 'blog'];

const getHistory = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    const requestedType = String(req.query.type || '').trim().toLowerCase();

    if (requestedType) {
      if (!VALID_TYPES.includes(requestedType)) {
        return res.status(400).json({ message: 'Invalid history filter type.' });
      }

      filter.type = requestedType;
    }

    const history = await Generation.find(filter).sort({ createdAt: -1 });

    return res.json({ history });
  } catch (error) {
    console.error('Get history controller error:', error);
    return res.status(500).json({ message: 'Unable to fetch generation history right now.' });
  }
};

const getHistoryItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid generation ID.' });
    }

    const generation = await Generation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!generation) {
      return res.status(404).json({ message: 'Generation not found.' });
    }

    return res.json({ generation });
  } catch (error) {
    console.error('Get history item controller error:', error);
    return res.status(500).json({ message: 'Unable to fetch this generation right now.' });
  }
};

const deleteHistoryItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid generation ID.' });
    }

    const generation = await Generation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!generation) {
      return res.status(404).json({ message: 'Generation not found.' });
    }

    return res.json({ message: 'Generation deleted successfully.' });
  } catch (error) {
    console.error('Delete history item controller error:', error);
    return res.status(500).json({ message: 'Unable to delete this generation right now.' });
  }
};

module.exports = {
  getHistory,
  getHistoryItem,
  deleteHistoryItem,
};
