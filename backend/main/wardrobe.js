const express = require('express');
const router = express.Router();
const ClothingItem = require('../Models/Apparel');

// Add a clothing item (with image in base64)
router.post('/add', async (req, res) => {
  try {
    const { email, type, color, formality, warmth, imageBase64 } = req.body;
    const item = await ClothingItem.create({ email, type, color, formality, warmth, imageBase64 });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get wardrobe for a specific use
router.get('/:userId', async (req, res) => {
  try {
    const items = await ClothingItem.find({ user: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;