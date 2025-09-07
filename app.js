// Require Libraries
const express = require('express');

// Require tenorjs near the top of the file
const Tenor = require("tenorjs").client({
  // Replace with your own key
  "Key": "AIzaSyDymbvDiQRpRQ3UWeH4WrllVOwm66YMTYU", // https://tenor.com/developer/keyregistration
  "Filter": "high", // "off", "low", "medium", "high", not case sensitive
  "Locale": "en_US", // Your locale here, case-sensitivity depends on input
});

// App Setup
const app = express();

// Middleware
// Middleware
// Allow Express (our web framework) to render HTML templates and send them back to the client using a new function
const handlebars = require('express-handlebars');

// Somewhere near the top
app.use(express.static('public'));

const hbs = handlebars.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo() { return 'FOO!'; },
        bar() { return 'BAR!'; }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
// Routes
// Routes
app.get('/', (req, res) => {
  // Handle the home page when we haven't queried yet
  let term = ""
  if (req.query.term) {
      term = req.query.term
  }
  
  console.log('Searching for term:', term);
  
  // Tenor.search.Query("SEARCH KEYWORD HERE", "LIMIT HERE")
  Tenor.Search.Query(term, "10")
      .then(response => {
          console.log('API Response:', response);
          // store the gifs we get back from the search
          const gifs = response;
          // pass the gifs as an object into the home page
          res.render('home', { gifs })
      }).catch(error => {
          console.error('API Error:', error);
          // Render page with empty gifs array if API fails
          res.render('home', { gifs: [] });
      });
})

app.get('/greetings/:name', (req, res) => {
  // grab the name from the path provided
  const name = req.params.name;
  // set the url of the gif
  const gifUrl = 'https://media1.tenor.com/images/561c988433b8d71d378c9ccb4b719b6c/tenor.gif?itemid=10058245'
  // render the greetings view, passing along the name and gifUrl
  res.render('greetings', { name, gifUrl });
})
// Start Server

app.listen(3000, () => {
  console.log('Gif Search listening on port localhost:3000!');
});