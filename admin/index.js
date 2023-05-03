const express = require('express');
const bodyparser = require('body-parser');
const sequelize = require('./util/database');
const kafka = require('kafka-node');
const controller = require('./controllers/books');
const Book = require('./models/book');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

//CRUD routes
app.use('/books', require('./controllers/books'));

const client = new kafka.KafkaClient({ kafkaHost:process.env.KAFKA_BOOTSTRAP_SERVERS });
const producer = new kafka.Producer(client);

producer.on('ready',  async () => {
    const hello = {
      message: 'Hello Woeld',
    }
    const payload = JSON.stringify(hello);
    const messages = [{ topic: 'topic1', messages: [payload], partition: 0 }];
    producer.send(messages, (error, data) => {
      if (error) {
        console.error(error);
      }
    });
})

producer.on('error', function (err) {
  console.error('Error occurred:', err);
});

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


