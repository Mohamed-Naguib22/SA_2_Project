const express = require('express');
const bodyparser = require('body-parser');
const { kafkaProducer } = require('./kafka-producer');

const app = express();

kafkaProducer(app)

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

//CRUD routes
app.use('/books', require('./controllers/bookController'));

//test route
app.get('/', (req, res, next) => {
  res.send('Hello World');
});

//error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});


