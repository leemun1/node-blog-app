const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const port = 3000 || process.env.PORT;

// Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Index Route
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.send('About');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});