const controller = require('../controllers/books');
const router = require('express').Router();

router.get('/', controller.getAllBooks); 
router.get('/:bookId', controller.getBook);
router.post('', controller.createBook);
router.put('/:bookId', controller.updateBook);
router.delete('/:bookId', controller.deleteBook);

module.exports = router;