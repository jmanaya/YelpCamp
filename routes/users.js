const express = require('express');
const passport = require('passport');
const catchAsync = require('../helpers/catchAsync');
const User = require('../models/user');
const ROUTE_OPTIONS = { mergeParams: true };
const router = express.Router(ROUTE_OPTIONS);

const AUTH_OPTIONS = { failureFlash: true, failureRedirect: '/login' };

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body.user;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    
    req.login(registeredUser, err => {
      if (err)
        return next(err);
      else {
        req.flash('success', 'New account created successfully! Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
      }
    });
  }
  catch (ex) {
    req.flash('error', ex.message);
    res.redirect('/register');
  }
}));

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', passport.authenticate('local', AUTH_OPTIONS), catchAsync(async (req, res) => {
  const redirectUrl = req.session.returnUrl || '/campgrounds';
  delete req.session.returnUrl;
  
  req.flash('success', 'Welcome back!');
  res.redirect(redirectUrl);
}));

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged out successfully!');
  res.redirect('/campgrounds');
});

module.exports = router;
