const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost:process.env.KAFKA_BOOTSTRAP_SERVERS });
const producer = new kafka.Producer(client);
exports.kafkaProducer = (app) => {
    producer.on('ready',  () => {
        initTopic();
    })

    producer.on('error', function (err) {
        console.error('Error occurred:', err);
    })
}

exports.KafkaSend = (payload) => {
    const messages = [{ topic:process.env.KAFKA_TOPIC, messages: [payload], partition: 0 }];
    producer.send(messages, (error, data) => {});
}

function initTopic ()  {
    const hello = {
        message: 'Hello Woeld',
    }
    const payload = JSON.stringify(hello);
    const messages = [{ topic: process.env.KAFKA_TOPIC, messages: [payload], partition: 0 }];
    producer.send(messages, (error, data) => {
        if (error) {
        console.error(error);
        }
    });
}


    