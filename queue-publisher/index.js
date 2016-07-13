var amqp = require('amqplib/callback_api');

var sendMessage = function(ch, q, content) {
  ch.assertQueue(q, {durable: true});
  // Note: on Node 6 Buffer.from(msg) should be used
  ch.sendToQueue(q, new Buffer(content));
  console.log(" [x] Sent %s into queue %s", content, q);
}

amqp.connect('amqp://rabbitmq', function(err, conn) {
  if (err) {
    console.log(err);
    return;
  }
  conn.createChannel(function(err, ch) {
    setInterval(function() {
      var counter = 0;
      while (counter <= 100) {
        var q = 'hello-' + counter;
        var data = {
          fixtureNumber: counter,
          score: {
            home: 10 + counter,
            away: 20 + counter
          }
        };
        var content = new Buffer(JSON.stringify(data));
        var i = 0;
        while (i <= 10) {
          content.fixtureNumber++;
          sendMessage(ch, q, content);
          i++;
        }
        counter++;
      }
    }, 1000);
  });
});
