const kafka = require('kafka-node');
const Book = require('./models/book');
const controller = require('./controllers/bookController');

exports.kafkaConsumer = (app) => {
    const client  = new kafka.KafkaClient({ kafkaHost:process.env.KAFKA_BOOTSTRAP_SERVERS });
    const consumer = new kafka.Consumer(client, [{ topic:process.env.KAFKA_TOPIC }], {autoCommit: false, fromOffset: 'latest'})
    
    consumer.on('message', async (message) => {
        messageHandler(message);
    })

    consumer.on('error', (err) => {
        console.log(err);
    })
}

async function messageHandler(message) {
    const book = await new Book(JSON.parse(message.value))
    const bookId = book.dataValues.id
    switch (book.method )
    {
        case 'POST':
            var exist = 0; 
            const bookNames = await Book.findAll({attributes:['name']})
            const names = bookNames.map(bookName => bookName.name);
            for (var i = 0; i < names.length; i++) {
              if (book.dataValues.name == names[i]) {
                console.log("This Book is Already Exists");
                exist = 1
              }
            }
            
            if (exist != 1){
              console.log(message.value);
              controller.addBook(book);
            }
            break;

        case 'PUT':
            console.log(message.value);
            controller.updateBook(book, bookId);
            break;

        case 'DELETE':
            console.log(message.value);
            controller.deleteBook(bookId)
            break;
        
        default:
            console.log(message.value);
    }
}