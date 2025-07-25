// scripts/eraseAllUserData.js
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../server/models/User');
const EcoAction = require('../server/models/EcoAction');
const Reward = require('../server/models/Reward');

async function eraseAllUserData() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const userDel = await User.deleteMany({});
    const actionDel = await EcoAction.deleteMany({});
    const rewardDel = await Reward.deleteMany({});
    // Add more collections if needed

    console.log(`Deleted ${userDel.deletedCount} users`);
    console.log(`Deleted ${actionDel.deletedCount} actions`);
    console.log(`Deleted ${rewardDel.deletedCount} rewards`);
    // Add more logs for other collections

    await mongoose.disconnect();
    console.log('All user data erased.');
  } catch (err) {
    console.error('Error erasing user data:', err);
    process.exit(1);
  }
}

eraseAllUserData();