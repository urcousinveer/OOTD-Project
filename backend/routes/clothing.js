const express = require('express');
const router = express.Router();
const ClothingItem = require('../models/ClothingItem');

// GET /clothing - fetch all clothing items
router.get('/', async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching clothing items' });
  }
});

module.exports = router;