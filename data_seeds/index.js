// Not tested, have not been seeding data:
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const geoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = geoCoding({accessToken: mapBoxToken});

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
        let city = `${cities[random].city}, ${cities[random].state}`
        let mapboxQuery = { query: city, limit: 1 };
        let geoData = await geoCoder.forwardGeocode(mapboxQuery).send();
        let geometry = geoData.body.features[0].geometry;
        let cg = new Campground({
            author: '60089af834775727e9d864fc',
            title: `${pickRandom(descriptors)} ${pickRandom(places)}`,
            location: city,
            geometry: geometry,
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
