const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const wardrobeRoutes = require('./main/wardrobe');


const outfitSuggestRoute = require('./routes/outfitSuggest');
const outfitReplaceRoute = require('./routes/outfitReplace');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow base64 images




mongoose.connect('mongodb://localhost:27017/ootd')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Mongo Error:', err));

app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/user', require('./routes/userRoute'));
app.use('/suggest-outfit', outfitSuggestRoute);
app.use('/replace-item', outfitReplaceRoute);

const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log('Server running on http://localhost:5000'));

