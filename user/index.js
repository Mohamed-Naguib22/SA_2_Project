const express = require('express');
const bodyparser = require('body-parser');
const sequelize = require('./util/database');
const Book = require('./models/book');
const kafka = require('kafka-node');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use('/books', require('./routes/books'));
app.use('/kafka', require('./Kafka-Controller/books'));

setTimeout(() => {
  const client  = new kafka.KafkaClient({ kafkaHost:process.env.KAFKA_BOOTSTRAP_SERVERS });
  const consumer = new kafka.Consumer(client, [{ topic:process.env.KAFKA_TOPIC }], {autoCommit: false})
  
  consumer.on('message', async (message) => {
    const book = await new Book(JSON.parse(message.value))
    if(book.dataValues.method == 1){
       console.log(message);
       await book.save();
    }

    else if (book.dataValues.method == 0) {
      console.log(message);
      const bookId = book.dataValues.id;
      Book.findByPk(bookId)
      .then(book => {
        if (!book) {
          console.log("Book is not Found !!");
        }
        return Book.destroy({
          where: {
            id: bookId
          }
        });
      })
      .then(result => {
        console.log("Book Deleted Successfully");
      })
      .catch(err => console.log(err));
    }
    else {
      console.log(message);
    }
  });
  
  consumer.on('error', (err) => {
    console.log(err);
  })

}, 5000)

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
