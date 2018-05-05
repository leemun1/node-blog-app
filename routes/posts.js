const express = require('express');
const router = express.Router();

// Load Post Model
const { Post } = require('../models/Post');

// Post Index Page
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: 'desc' })
    .then((posts) => {
      res.render('posts/index', {
        posts
      });
    });
});

// Add Post Form
router.get('/add', (req, res) => {
  res.render('posts/add');
});

// Process Add Post Form
router.post('/', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.text) {
    errors.push({ text: 'Please add some content' });
  }

  if (errors.length > 0) {
    res.render('posts/add', {
      errors,
      title: req.body.title,
      text: req.body.text
    });
  } else {
    let body = {
      title: req.body.title,
      text: req.body.text
    }
    new Post(body)
      .save()
      .then(post => {
        req.flash('success_msg', 'New post added.');
        res.redirect('/posts');
      });
  }
});

// Edit Post Form
router.get('/edit/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
    .then(post => {
      res.render('posts/edit', { post });
    })
});

// Process Edit Form
router.put('/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
    .then(post => {
      post.title = req.body.title;
      post.text = req.body.text;
      post.save()
        .then(post => {
          req.flash('success_msg', 'Post successfully updated.');
          res.redirect('/posts');
        });
    });
});

// Delete Post Route
router.delete('/:id', (req, res) => {
  Post.remove({
    _id: req.params.id
  })
    .then(() => {
      req.flash('success_msg', 'Post successfully removed.');
      res.redirect('/posts');
    });
});

module.exports = router;