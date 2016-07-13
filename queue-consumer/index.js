var amqp = require('amqplib/callback_api');

amqp.connect('amqp://rabbitmq', function(err, conn) {
  if (err) {
    console.log(err);
    return;
  }

  conn.createChannel(function(err, ch) {
    counter = 0;
    while (counter <= 100) {
      var q = 'hello-' + counter;
      ch.assertQueue(q, {durable: true});
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
      ch.consume(q, function(msg) {
        console.log(" [x] Channel %s receives %s", q, msg.content.toString());
      }, {noAck: true});
      counter++;
    }
  });
});
