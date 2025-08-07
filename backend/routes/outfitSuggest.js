// routes/outfitsuggest
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Wardrobe = require('../models/ClothingItem'); // MongoDB model
const OutfitHistory = require('../models/OFHistory'); 
    
router.post('/', async (req, res) => {
  try {
    const { email, temp, weatherMain } = req.body;

    if (!email || !temp || !weatherMain) {
      return res.status(400).json({ error: 'Missing required data: email, temp, or weather.' });
    }


// 2. Apply fashion logic 
    let tagsNeeded = [];

    if (temp < 10) {
      tagsNeeded = ['jacket', 'Jeans', 'Shirt'];
    } else if (temp >= 10 && temp <= 15) {
      tagsNeeded = ['Jeans', 'Shirt', 'Hoodie'];
    }
    else if (temp >= 16 && temp <= 20) {
      tagsNeeded = ['Jeans' || 'Shorts' , 'T-shirt'];
    } else {
      tagsNeeded = ['Shorts', 'T-shirt'];
    }


        let suggestions = [];

    for (const tag of tagsNeeded) {
      const item = await Wardrobe.findOne({
        email, // only current user
        type: tag
      });

      if (item) {
        suggestions.push(item);
      }
    }
    
       // 3. Find recently worn item IDs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentHistory = await OutfitHistory.find({
      email,
      wornDate: { $gte: sevenDaysAgo }
    });
    const recentlyWornItemIds = recentHistory.map(h => h.itemId.toString());

    // 4. Fetch matching wardrobe items from DB
    const allMatchingItems = await Wardrobe.find({
      email,
      type: { $in: tagsNeeded }
    });

    console.log('All Matching Items:', allMatchingItems.map(i => `${i.type} - ${i.name}`));

    const grouped = {};
allMatchingItems.forEach(item => {
  const type = item.type.toLowerCase();
  if (!grouped[type]) grouped[type] = [];
  grouped[type].push(item);
});

// Pick one random item for each tag in tagsNeeded
const pickRandom = arr => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

const finalSuggestions = [];
tagsNeeded.forEach(tag => {
  const lowerTag = tag.toLowerCase();
  if (grouped[lowerTag]) {
    const selected = pickRandom(grouped[lowerTag]);
    if (selected) finalSuggestions.push(selected);
  }
});

// Final response
return res.json({
  weather: { temp, weatherMain },
  tagsNeeded,
  suggestions: finalSuggestions
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
