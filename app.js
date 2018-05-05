const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Load Models
const { Post } = require('./models/Post');

const app = express();
const port = 3000 || process.env.PORT;

// Connect to DB
mongoose.connect('mongodb://localhost:27017/BlogApp')
  .then(() => console.log('---MongoDB Conneted---'))
  .catch(err => console.log(err));

// Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Index Route
app.get('/', (req, res) => {
  res.render('index');
}); 

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Post Index Page
app.get('/posts', (req, res) => {
  Post.find()
    .sort({date:'desc'})  
    .then((posts) => {
      res.render('posts/index', {
        posts
      });
    });
});

// Add Post Form
app.get('/posts/add', (req, res) => {
  res.render('posts/add');
}); 

app.post('/posts', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({text: 'Please add a title'});
  }
  if (!req.body.text) {
    errors.push({text: 'Please add some content'});
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
        res.redirect('/posts');
      });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});