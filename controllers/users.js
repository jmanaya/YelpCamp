const User = require('../models/user');

module.exports.getIndex = (req, res) => {
  res.render('users/register');
};

module.exports.postNew = async (req, res, next) => {
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
};

module.exports.getLogin = (req, res) => {
  res.render('users/login');
};

module.exports.postLogin = async (req, res) => {
  const redirectUrl = req.session.returnUrl || '/campgrounds';
  delete req.session.returnUrl;
  
  req.flash('success', 'Welcome back!');
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res) => {
  req.logout();
  req.flash('success', 'Logged out successfully!');
  res.redirect('/campgrounds');
};
