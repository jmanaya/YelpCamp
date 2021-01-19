const express = require('express');
const ROUTE_OPTIONS = { mergeParams: true };
const router = express.Router(ROUTE_OPTIONS);
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/expressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewValidationSchema } = require('../helpers/validationSchemas');

const validateReview = (req, res, next) => {
  const { error } = reviewValidationSchema.validate(req.body);
  
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg);
  } else {
    next();
  }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.campgroundId);

  if (!campground) {
    req.flash('error', 'No campground was found with the ID provided.');
    return res.redirect('/campgrounds');
  }

	const review = new Review(req.body.review);
	campground.reviews.push(review);
	await review.save();
	await campground.save();
  req.flash('success', 'Review added successfully!');
	res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { campgroundId, reviewId } = req.params;
  await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted succesfully');
  res.redirect(`/campgrounds/${campgroundId}`);
}));

module.exports = router;
