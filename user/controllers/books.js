const Book = require('../models/book');
// GET All Controller
exports.getAllBooks = (req, res, next) => {
    Book.findAll()
        .then(books => {
            res.status(200).json({ books: books });
        })
        .catch(err => console.log(err));
}

// GET By ID Controller
exports.getBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findByPk(bookId)
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Book not found!' });
            }
            res.status(200).json({ book: book });
        })
        .catch(err => console.log(err));
}

// POST Controller
exports.createBook = (req, res, next) => {
    const name = req.body.name;
    const author = req.body.author;
    Book.create({
      name: name,
      author: author
    })
      .then(result => {
        console.log('Created Book');
        res.status(201).json({
          message: 'Book created successfully!',
          book: result
        });
      })
      .catch(err => {
        console.log(err);
      }); 
}

// PUT Controller
exports.updateBook = (req, res, next) => {
    const bookId = req.params.bookId;
    const updatedName = req.body.name;
    const updatedAuthor = req.body.author;
    Book.findByPk(bookId)
      .then(book => {
        if (!book) {
          return res.status(404).json({ message: 'Book not found!' });
        }
        book.name = updatedName;
        book.author = updatedAuthor;
        return book.save();
      })
      .then(result => {
        res.status(200).json({message: 'Book updated!', book: result});
      })
      .catch(err => console.log(err));
}
  
// DELETE Controller
exports.deleteBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findByPk(bookId)
      .then(book => {
        if (!book) {
          return res.status(404).json({ message: 'Book not found!' });
        }
        return Book.destroy({
          where: {
            id: bookId
          }
        });
      })
      .then(result => {
        res.status(200).json({ message: 'Book deleted!' });
      })
      .catch(err => console.log(err));
}