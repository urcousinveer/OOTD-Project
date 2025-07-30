const express = require('express');
const router = express.Router();
const Wardrobe = require('../main/wardrobe');
const OutfitHistory = require('../Models/OFHistory');
const colorCombos = require('../Utilities/colorcombos'); 

router.get('/replace-item', async (req, res) => {
  const { email, type, keepTopId, keepBottomId, keepShoeId } = req.query;

  try {
    // Get the kept items
    const top = keepTopId ? await Wardrobe.findById(keepTopId) : null;
    const bottom = keepBottomId ? await Wardrobe.findById(keepBottomId) : null;
    const shoe = keepShoeId ? await Wardrobe.findById(keepShoeId) : null;

    // Decide color compatibility target
    let colorTargets = [];
    if (type === 'top' && bottom) colorTargets.push(bottom.color.toLowerCase());
    if (type === 'bottom' && top) colorTargets.push(top.color.toLowerCase());
    if (type === 'shoe' && top) colorTargets.push(top.color.toLowerCase());
    if (type === 'shoe' && bottom) colorTargets.push(bottom.color.toLowerCase());

    const allShoes = await Wardrobe.find({ userEmail: email, type });
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentHistory = await OutfitHistory.find({
      userEmail: email,
      wornDate: { $gte: sevenDaysAgo }
    });
    const recentlyWornIds = recentHistory.map(e => e.itemId.toString());

    // Filter replacements
    let options = allShoes.filter(item => {
      const color = item.color.toLowerCase();
      const warmthOk =
        item.warmthLevel >= (top || bottom || shoe)?.warmthLevel - 1;

      const colorOk = colorTargets.some(c => colorCombos[c]?.includes(color));
      const notRecentlyWorn = !recentlyWornIds.includes(item._id.toString());

      return warmthOk && colorOk && notRecentlyWorn;
    });

    // Fallback: allow any same-type item
    if (options.length === 0) {
      options = allShoes;
    }

    // Return a random suggestion
    const random = options[Math.floor(Math.random() * options.length)];

    res.json({
      replacement: random
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to replace item.' });
  }
});
module.exports = router;