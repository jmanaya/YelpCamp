const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews')
const ExpressError = require('./helpers/expressError');

const PORT_NO = 3000;
const DB_URL = 'mongodb://localhost:27017/yelp-camp';
const MONGO_OPTIONS = { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true,
    useFindAndModify: false 
};

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const SESSION_OPTIONS = {
  secret: 'BETTER SECRET GOES HERE',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + (MILLISECONDS_PER_DAY * 7),
    maxAge: (MILLISECONDS_PER_DAY * 7)
  }
};

mongoose.connect(DB_URL, MONGO_OPTIONS);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => console.log('Connected to database.'));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(SESSION_OPTIONS));
app.use(flash());
// Flash Middleware - Make Flash Messages Accessible from Views:
app.use( (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:campgroundId/reviews', reviewRoutes);

app.get('/', (req, res) => res.render('home'));

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
});

app.use( (err, req, res, next) => {
    err.statusCode = err.statusCode ? err.statusCode : 500;
    err.message = err.message ? err.message : 'Unexpected error';
  
    if (err.message.includes('Cast to ObjectId')) {
      err.message = 'Page Not Found (Invalid ID)';
      err.statusCode = 404;
    }

    res.render('errorPage', { err });
});

app.listen(PORT_NO, () => console.log(`Serving application on Port #${PORT_NO}`));
