const Sequelize = require('sequelize');
const db = require('../util/database');

const Book = db.define('book', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    author: Sequelize.STRING,
    method: Sequelize.STRING
    // POST --> TRUE
    // DELETE --> FALSE
});

module.exports = Book;