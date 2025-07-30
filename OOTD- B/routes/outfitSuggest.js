// Required modules
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Wardrobe = require('../main/wardrobe'); // MongoDB model

// Example endpoint: /suggest-outfit?email=user@example.com
router.get('/suggest-outfit', async (req, res) => {
  const { email } = req.query;

  try {
    // 1. Fetch current weather
    const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
     
      }
    });

    const temp = weatherResponse.data.main.temp;
    const weatherMain = weatherResponse.data.weather[0].main;

    // 2. Apply fashion logic
    let tagsNeeded = [];

    if (weatherMain === 'Rain') {
      tagsNeeded = ['raincoat', 'waterproof', 'boots'];
    } else if (temp < 10) {
      tagsNeeded = ['jacket', 'hoodie', 'boots'];
    } else if (temp >= 10 && temp <= 20) {
      tagsNeeded = ['jeans', 'shirt', 'sneakers'];
    } else {
      tagsNeeded = ['shorts', 't-shirt', 'sandals'];
    }

       // 3. Find recently worn item IDs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentHistory = await OutfitHistory.find({
      userEmail: email,
      wornDate: { $gte: sevenDaysAgo }
    });
    const recentlyWornItemIds = recentHistory.map(h => h.itemId.toString());

    // 4. Fetch matching wardrobe items from DB
    const matchedItems = await Wardrobe.find({
      userEmail: email,
      tags: { $in: tagsNeeded }
    });
    

    // 5. Return outfit suggestion
    res.json({
      weather: { temp, weatherMain },
      tagsNeeded,
      suggestions: matchedItems
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
