const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User Model
const { User } = require('../models/User');

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Signup Route
router.get('/signup', (req, res) => {
  res.render('users/signup');
});

// Process User Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {  
    successRedirect: '/posts',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Proces User Signup 
router.post('/signup', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match.' });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'Passwords must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/signup', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'That email is already registered.');
          res.redirect('/users/login');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Welcome! You are now registered. Please go ahead and login.');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  return console.log(err);
                })
            });
          });
        }
      });
  }
});

module.exports = router;