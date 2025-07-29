const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // ✅ makes userId mandatory
  },
  name: String,
  type: String,
  color: String,
  season: [String],
  formality: String,
  warmth: Number,
  imageUrl: String
});

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
