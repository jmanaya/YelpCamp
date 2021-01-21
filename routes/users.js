const express = require('express');
const passport = require('passport');
const catchAsync = require('../helpers/catchAsync');
const users = require('../controllers/users');

const AUTH_OPTIONS = { failureFlash: true, failureRedirect: '/login' };
const ROUTE_OPTIONS = { mergeParams: true };
const router = express.Router(ROUTE_OPTIONS);

router.route('/register')
  .get(users.getIndex)
  .post(catchAsync(users.postNew));

router.route('/login')
  .get(users.getLogin)
  .post(passport.authenticate('local', AUTH_OPTIONS), catchAsync(users.postLogin));

router.get('/logout', users.logOut);

module.exports = router;
