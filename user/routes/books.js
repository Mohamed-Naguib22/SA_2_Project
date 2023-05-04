const controller = require('../controllers/bookController');
const router = require('express').Router();

router.get('/', controller.getAllBooks); 
router.get('/:bookId', controller.getBook);

module.exports = router;