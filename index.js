const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

const PORT_NO = 3000;
const DB_URL = 'mongodb://localhost:27017/yelp-camp';
const MONGO_OPTIONS = { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true,
    useFindAndModify: false 
};

mongoose.connect(DB_URL, MONGO_OPTIONS);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => console.log('Connected to database.'));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.listen(PORT_NO, () => console.log(`Serving application on Port #${PORT_NO}`));

app.get('/', (req, res) => res.render('home'));

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/details', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});
