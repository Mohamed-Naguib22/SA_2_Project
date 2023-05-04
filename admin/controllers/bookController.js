const Book = require('../models/book');
const {KafkaSend } = require('../kafka-producer');
const router = require('express').Router();

// POST Controller
router.post('/', async (req, res) => {
  const book = new Book(req.body.name, req.body.author, req.body.method)
  const payload = JSON.stringify(book);
  KafkaSend(payload);
  return res.status(200).json({ message: `Message Sent Successfully`});
});

// PUT Controller
router.put( '/:bookId', async (req, res, next) => {
  const {bookId} = req.params;
  const book = new Book(req.body.name, req.body.author, req.body.method)
  const payload = JSON.stringify({id: bookId, name:book.name, author:book.author, method:book.method});
  KafkaSend(payload);
  return res.status(200).json({ message: `Message Sent Successfully`});
})

// DELETE Controller
router.delete( '/:bookId', async (req, res, next) => {
  const {bookId} = req.params;
  const book = new Book(req.body.name, req.body.author, req.body.method)
  const payload = JSON.stringify({id:bookId, method:book.method});
  KafkaSend(payload);
  return res.status(200).json({ message: `Message Sent Successfully`});
})

module.exports = router;
