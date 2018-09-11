const express = require ('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require ('body-parser');

const jsonParser = bodyParser.json();
const app = express();

const blogpostsRouter = require('./blogpostsRouter');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/blog-posts', blogpostsRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});