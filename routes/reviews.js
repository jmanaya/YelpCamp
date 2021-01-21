const express = require('express');
const catchAsync = require('../helpers/catchAsync');
const reviews = require('../controllers/reviews');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../helpers/middleware');

const ROUTE_OPTIONS = { mergeParams: true };
const router = express.Router(ROUTE_OPTIONS);

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.postNew));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.delete));

module.exports = router;
