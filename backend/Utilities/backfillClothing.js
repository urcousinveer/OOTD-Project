// backend/Utilities/backfillClothing.js
require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});
const mongoose     = require('mongoose');
const ClothingItem = require('../models/ClothingItem');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const userId = '689137a772a4fe2c45253cc1';

  const result = await ClothingItem.updateMany(
    { userId: { $exists: false } },
    { $set: { userId: new mongoose.Types.ObjectId(userId) } }
  );

  // inspect what the result actually contains:
  console.log('Raw updateMany result:', result);

  // normalize to modifiedCount or nModified
  const count = result.modifiedCount ?? result.nModified ?? 0;
  console.log(`✅ Backfilled ${count} clothing items`);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
