const express = require('express');
const bodyparser = require('body-parser');
const sequelize = require('./util/database');
const { kafkaConsumer } = require('./kafka-consumer');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use('/books', require('./routes/books'));

setTimeout(() => {
  kafkaConsumer(app);
}, 10000)

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

//sync database
sequelize
  .sync()
  .then(result => {
    console.log("Database connected");
    app.listen(3000);
  })
  .catch(err => console.log(err));
