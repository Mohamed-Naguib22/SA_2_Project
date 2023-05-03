const Book = require('../models/book');
const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost:process.env.KAFKA_BOOTSTRAP_SERVERS });
const router = require('express').Router();

// POST Controller
router.post('/', async (req, res) => {
  const producer = new kafka.Producer(client);
  try {
    const payload = JSON.stringify(req.body);
    const messages = [{ topic: 'topic1', messages: [payload], partition: 0 }];
    producer.send(messages, (error, data) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating book' });
      } else {
        res.status(201).json({ message: `Book Created Successfully`});
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating book'});
  }
});

//DELETE Controller
router.delete( '/:bookId', (req, res, next) => {
  const producer = new kafka.Producer(client);
  const payload = JSON.stringify({id: req.params.bookId});
  const messages = [{ topic: 'topic1', messages: [payload], partition: 0 }];
  producer.send(messages, (error, data) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Error Deleting Book' });
    } else {
      res.status(201).json({ message: `Book Deleted Successfully`});
    }
  });
})
module.exports = router;
