const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const wardrobeRoutes = require('./main/wardrobe');

const app = express();
app.use(cors());
app.use(express.json());

const User = require('./models/User');
const ClothingItem = require('./models/ClothingItem');
const outfitSuggestRoute = require('./routes/outfitSuggest');
const outfitReplaceRoute = require('./routes/outfitReplace');

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // --- TEST DATA (remove/comment out in production) ---
    let user = await User.findOne({ email: 'ajay@gmail.com' });
    if (!user) {
      user = await User.create({
        email: 'ajay@gmail.com',
        password: 'Ajay123'
      });
      console.log('✅ Test user created!');
    } else {
      console.log('✅ Test user exists');
    }

    const existsItem = await ClothingItem.findOne({ name: 'Black Hoodie', userId: user._id });
    if (!existsItem) {
      await ClothingItem.create({
        userId: user._id,
        name: 'Black Hoodie',
        type: 'jacket',
        color: 'black',
        season: ['fall', 'winter'],
        formality: 'casual',
        warmth: 8,
        imageUrl: 'https://example.com/hoodie.jpg'
      });
      console.log('✅ Test clothing item saved!');
    } else {
      console.log('✅ Test clothing item exists');
    }
  })
  .catch(err => console.error(' Connection error:', err));

// --- API ROUTES ---

// Create a new clothing item
app.post('/api/clothing', async (req, res) => {
  try {
    const { email, name, type, color, season, formality, warmth, imageUrl } = req.body;

    //  Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create and save the clothing item
    const item = await ClothingItem.create({
      userId: user._id,
      name,
      type,
      color,
      season,
      formality,
      warmth,
      imageUrl
    });

    // Send back the new item
    res.status(201).json({ message: 'Clothing item saved!', item });
  } catch (err) {
    console.error(' Upload error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/clothing/:email — returns all items for a given user
app.get('/api/clothing/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const items = await ClothingItem.find({ userId: user._id });
    res.json(items);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch clothing items' });
  }
});



app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/user', require('./routes/userRoute'));
app.use('/suggest-outfit', outfitSuggestRoute);
app.use('/replace-item', outfitReplaceRoute);


app.listen(5000, () => console.log(' Server on port 5000'));
