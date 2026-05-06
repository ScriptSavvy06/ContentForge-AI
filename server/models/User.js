const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  },
  generationsUsed: {
    type: Number,
    default: 0,
    min: 0,
  },
  generationsLimit: {
    type: Number,
    default: 10,
    min: 1,
  },
});

userSchema.methods.toJSON = function toJSON() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
