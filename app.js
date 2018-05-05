const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

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

// Method Override Middleware
app.use(methodOverride('_method'));

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

// Process Add Post Form
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

// Edit Post Form
app.get('/posts/edit/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
    .then(post => {
      res.render('posts/edit', { post });
    })
});

// Process Edit Form
app.put('/posts/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
  .then(post => {
    post.title = req.body.title;
    post.text = req.body.text;
    post.save()
      .then(post => {
        res.redirect('/posts');
      });
  });
});

app.delete('/posts/:id', (req, res) => {
  Post.remove({
    _id: req.params.id
  })
  .then(() => {
    res.redirect('/posts');
  })
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});