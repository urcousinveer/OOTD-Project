const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  email: { type: String, required: true },
  type: String,
  tags: String,
  color: String,
  formality: String,
  warmth: Number,
  imageBase64: String, // store image as base64 string
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClothingItem', clothingItemSchema);