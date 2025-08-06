// backend/server.js
require('dotenv').config();
const express       = require('express');
const mongoose      = require('mongoose');
const cors          = require('cors');

const User          = require('./models/User');
const ClothingItem  = require('./models/ClothingItem');
const userRoute         = require('./routes/userRoute');
const wardrobeRoutes    = require('./main/wardrobe');
const outfitSuggestRoute= require('./routes/outfitSuggest');
const outfitReplaceRoute= require('./routes/outfitReplace');

const app = express();
app.use(cors({origin: 'http://localhost:3000', 
  credentials: true   }));
app.use(express.json());

const clothingRoute = require('./routes/clothing');
app.use('/clothing', clothingRoute);
// ─── Connect to MongoDB & Seed Test Data ─────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');


   const existsItem = await ClothingItem.findOne({
      name:   'Black Hoodie',
      userId: user._id,
      
    });
    if (!existsItem) {
      await ClothingItem.create({
        userId:    user._id,
        email:  'ajay@gmail.com',
        name:      'Black Hoodie',
        type:      'jacket',
        color:     'black',
        season:    ['fall', 'winter'],
        formality: 'casual',
        warmth:    8,
        imageUrl:  'https://example.com/hoodie.jpg',
      });
      console.log('✅ Test clothing item saved!');
    } else {
      console.log('✅ Test clothing item exists');
    }
    // ──────────────────────────────────────────────────────
  })
  .catch(err => console.error('❌ Connection error:', err));
// ─── Auth / User Routes ───────────────────────────────────────────────────────
app.use('/api', userRoute);

// ─── Create a new clothing item ───────────────────────────────────────────────
app.post('/api/clothing', async (req, res) => {
  try {
    console.log('→ POST /api/clothing body:', req.body);
    const { email, name, type, color, season, formality, warmth, imageUrl } = req.body;

    // 1️⃣ Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 2️⃣ Create and save the clothing item
    const item = await ClothingItem.create({
      userId:    user._id,
      name,
      type,
      color,
      season,
      formality,
      warmth,
      imageUrl,
    });

    console.log('✅ New item saved:', item);
    return res.status(201).json({ item });
  } catch (err) {
    console.error('❌ Upload error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// ─── Debug: fetch _every_ clothing item ────────────────────────────────────────
app.get('/api/_all_clothing', async (req, res) => {
  try {
    const all = await ClothingItem.find({});
    console.log(`→ GET /api/_all_clothing count: ${all.length}`);
    return res.json(all);
  } catch (err) {
    console.error('❌ Fetch all error:', err);
    return res.status(500).json({ error: 'Failed to fetch all items' });
  }
});
// ─── Fetch per-user items ───────────────────────────────────────────────────────
app.get('/api/clothing/:email', async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`→ GET /api/clothing/${email}`);

    const user = await User.findOne({ email });
    console.log('   found user:', user?._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const items = await ClothingItem.find({ userId: user._id });
    console.log(`   found ${items.length} items`);
    return res.json(items);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch clothing items' });
  }
});
// ─── Other Routes ──────────────────────────────────────────────────────────────
app.use('/api/wardrobe',   wardrobeRoutes);
app.use('/suggest-outfit', outfitSuggestRoute);
app.use('/replace-item',   outfitReplaceRoute);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
