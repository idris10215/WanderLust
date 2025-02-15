const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main().then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

const init = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '679452aed49f47aedd239cec'}));
    await Listing.insertMany(initData.data);
    console.log('Data initialized');
}

init();