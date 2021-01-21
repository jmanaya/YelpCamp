const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundValidationSchema, reviewValidationSchema } = require('../helpers/validationSchemas');
const ExpressError = require('./expressError');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnUrl = req.originalUrl;
    req.flash('error', 'You must be logged in.');
    return res.redirect('/login');
  } else {
    next();
  }
};

module.exports.isAuthor = async(req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You cannot edit campgrounds that were not added by you.');
    res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async(req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You cannot modify other users\' reviews.');
    res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewValidationSchema.validate(req.body);
  
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundValidationSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};
