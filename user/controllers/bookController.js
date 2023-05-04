const Book = require('../models/book');
// GET All Controller
exports.getAllBooks = (req, res, next) => {
    Book.findAll()
        .then(books => {
            return res.status(200).json({ books: books });
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
            return res.status(200).json({ book: book });
        })
        .catch(err => console.log(err));
}

exports.addBook = (book) => {
    const name = book.name;
    const author = book.author;
    Book.create({
      name: name,
      author: author
    })
}

exports.updateBook = (book, bookId) => {
    const updatedName = book.name;
    const updatedAuthor =book.author;
    Book.findByPk(bookId)
    .then(book => {
      if (!book) {
        console.log("Book is Not Found")
      }

      else {
        book.name = updatedName;
        book.author = updatedAuthor;
        return book.save();
      }
    })
}

exports.deleteBook = (bookId) => {
    Book.findByPk(bookId)
    .then(book => {
      if (!book) {
        console.log("Book is not Found !!");
      }
      else {
        return Book.destroy({
          where: {
              id: bookId
          }
        });
      }
    })
}