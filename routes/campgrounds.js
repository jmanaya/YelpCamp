const express = require('express');
const catchAsync = require('../helpers/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../helpers/middleware');

const ROUTE_OPTIONS = { mergeParams: true };
const router = express.Router(ROUTE_OPTIONS);

router.route('/')
  .get(catchAsync(campgrounds.getIndex))
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.postNew));

router.get('/new', isLoggedIn, campgrounds.getNew);

router.route('/:id')
  .get(catchAsync(campgrounds.getDetails))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.putEdit))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.getEdit));

module.exports = router;
