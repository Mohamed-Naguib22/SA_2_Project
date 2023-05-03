const Book = require('../models/book');
const kafka = require('kafka-node');
const router = require('express').Router();

router.get('/', async (req, res, next) => {
  const client  = new kafka.KafkaClient({ kafkaHost:process.env.KAFKA_BOOTSTRAP_SERVERS });
  const consumer = new kafka.Consumer(client, [{ topic:process.env.KAFKA_TOPIC }], {autoCommit: false})
  let msgs = []
  let i = 0;
   consumer.on('message', async (message) => {
    var m = JSON.parse(message.value)
    msgs.push(m);
    i++;
    if (i == message.highWaterOffset ){
      res.json(msgs);
    }
  });
})

// router.get('/:bookId', async (req, res, next) => {
//     const client  = new kafka.KafkaClient({ kafkaHost:process.env.KAFKA_BOOTSTRAP_SERVERS });
//     const consumer = new kafka.Consumer(client, [{ topic:process.env.KAFKA_TOPIC }], {autoCommit: false})
//     const bookId = req.params.bookId;
//     consumer.on('message', async (message) => {
//       const book = await new Book(JSON.parse(message.value))
//       if (bookId == book.id)
//         return res.json(book)
      
//       //return res.json({message: "Book is Not Found !"})
//     });
// })
module.exports = router;
