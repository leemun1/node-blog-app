const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
const port = 3000 || process.env.PORT;

// Load Routes
const posts = require('./routes/posts');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

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

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override Middleware
app.use(methodOverride('_method'));

// Express session Middleware
app.use(session({
  secret: 'purrr',
  resave: false,
  saveUninitialized: true,
}));

// Flash Middleware
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();  
});

// Index Route
app.get('/', (req, res) => {
  res.render('index');
}); 

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

app.use('/posts', posts);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});