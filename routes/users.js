const express = require('express');
const router = express.Router();

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Signup Route
router.get('/signup', (req, res) => {
  res.render('users/signup');
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
    console.log(req.body);
    res.send('passed');
  }
});

module.exports = router;