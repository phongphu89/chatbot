'use strict';
const APP_SECRET = '35d0e15227d015a91bd26d7e893365b7';
const PAGE_ACCESS_TOKEN = 'EAACmjgn0xqcBAPlvZCkAHXjjD2uJMEW9bzeyWzuMZAi8kNksN3JjPJirw8ZBih1DjR2Ss9ZCpCJBy2G5CRaJQg1TEX2C8854lYEZALniX3gLbZCsEte8Er8hr8iqAGHxqmzMSpmpZAHsleA3sZBPHDFLzgZAhfvMb986xJ7BCtNcBuAjzNR7Ly44YNQDZBTRpTTwUZD';

var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) { // Đây là path để validate tooken bên app facebook gửi qua




res.send(req.query);





    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "token_random";
 
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
 
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
 
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
 
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
 
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }




  // if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
  //   res.send(req.query['hub.challenge']);
  // }
  // res.send('Error, wrong validation token 123');
});

app.post('/webhook', function(req, res) { // Phần xử lý tin nhắn của người dùng gửi đến
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        if (message.message.text) {
          var text = message.message.text;
          sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
        }
      }
    }
  }
  res.status(200).send("OK");
});

// Đây là function dùng api của facebook để gửi tin nhắn
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

app.set('port', process.env.PORT || 5000);
app.set('ip', process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});