// # SimpleServer
// A simple chat bot server
 

const APP_SECRET = '35d0e15227d015a91bd26d7e893365b7';
const VALIDATION_TOKEN  = 'token_random'; 
const PAGE_ACCESS_TOKEN = 'EAACmjgn0xqcBAPlvZCkAHXjjD2uJMEW9bzeyWzuMZAi8kNksN3JjPJirw8ZBih1DjR2Ss9ZCpCJBy2G5CRaJQg1TEX2C8854lYEZALniX3gLbZCsEte8Er8hr8iqAGHxqmzMSpmpZAHsleA3sZBPHDFLzgZAhfvMb986xJ7BCtNcBuAjzNR7Ly44YNQDZBTRpTTwUZD';



var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var router = express();
 
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
 
app.listen(process.env.PORT || 3000);
 
app.get('/', (req, res) => {
  res.send("Server chạy ngon lành.");
});
 
app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});
 
// Đoạn code xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // Nếu người dùng gửi tin nhắn đến
        if (message.message.text) {
          var text = message.message.text;
          if(text == 'hi' || text == "hello")
          {
            sendMessage(senderId, "Trung Quân's Bot: " + 'Xin Chào');
          }
          else{sendMessage(senderId, "Trung Quân's Bot: " + "Xin lỗi, câu hỏi của bạn chưa có trong hệ thống, chúng tôi sẽ cập nhật sớm nhất.");}
        }
      }
    }
  }
 
  res.status(200).send("OK");
});
 
// Gửi thông tin tới REST API để Bot tự trả lời
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