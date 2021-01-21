const express = require('express');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/expressError');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../helpers/middleware');

const ROUTE_OPTIONS = { mergeParams: true };
const router = express.Router(ROUTE_OPTIONS);

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully added a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');

    if (!campground) {
      req.flash('error', 'No campground was found with the ID provided.');
      return res.redirect('/campgrounds');
    }

    res.render('campgrounds/details', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
      req.flash('error', 'No campground was found with the ID provided.');
      return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!');
    res.redirect('/campgrounds');
}));

module.exports = router;
