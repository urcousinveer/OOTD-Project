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
      tagsNeeded = ['jacket', 'hoodie', 'Jeans'];
    } else if (temp >= 10 && temp <= 20) {
      tagsNeeded = ['Jeans', 'Shirt', 'T-shirt'];
    } else {
      tagsNeeded = ['Shorts', 'T-shirt', 'Jeans'];
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

    // Group by type
const grouped = {
  Shirt: [],
  Jeans: [],
  'T-shirt': [],
  hoodie: [],
  jacket: [],
  shorts: [],
};

allMatchingItems.forEach(item => {
  if (grouped[item.type]) {
    grouped[item.type].push(item);
  }
});

// Random picker
const pickRandom = arr => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

// Build the suggested outfit (1 shirt + 1 jeans, if available)
const finalSuggestions = [];

if (tagsNeeded.includes('shirt')) {
  const shirt = pickRandom(grouped.Shirt);
  if (shirt) finalSuggestions.push(shirt);
}

if (tagsNeeded.includes('Jeans')) {
  const jeans = pickRandom(grouped.Jeans);
  if (jeans) finalSuggestions.push(jeans);
}


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
