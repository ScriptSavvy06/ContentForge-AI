const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['resume', 'email', 'blog'],
    required: true,
  },
  prompt: {
    type: String,
    required: true,
    trim: true,
  },
  output: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

generationSchema.pre('validate', function setTitleFromPrompt(next) {
  if (this.prompt) {
    const cleanPrompt = this.prompt.replace(/\s+/g, ' ').trim();
    this.prompt = cleanPrompt;
    this.title = cleanPrompt.slice(0, 50);
  }

  next();
});

module.exports = mongoose.model('Generation', generationSchema);
