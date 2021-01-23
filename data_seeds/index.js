const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const DB_URL = 'mongodb://localhost:27017/yelp-camp';
const MONGO_OPTIONS = { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true };

mongoose.connect(DB_URL, MONGO_OPTIONS);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => console.log('Connected to database.'));

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    
    for (let i = 0; i < 50; i++)
    {
        let random = Math.floor(Math.random() * 1000); // Random number from list of 1,000 cities.
        let randomPrice = Math.floor(Math.random() * 17) * 1.25;
        let cg = new Campground({
            author: '60089af834775727e9d864fc',
            title: `${pickRandom(descriptors)} ${pickRandom(places)}`,
            location: `${cities[random].city}, ${cities[random].state}`,
            images: [
              { url: 'https://res.cloudinary.com/da88w7eqf/image/upload/v1611291146/YelpCamp/01.jpg', 
                filename: 'YelpCamp/' },
              { url: 'https://res.cloudinary.com/da88w7eqf/image/upload/v1611291146/YelpCamp/02.jpg', 
                filename: 'YelpCamp/' }
            ],
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis, fugiat.',
            price: randomPrice
        });
        await cg.save();
    }
}

seedDb();
