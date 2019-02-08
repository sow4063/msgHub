'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const https = require('https');
const app = express();

const config = {
    channelSecret: 'bd318f73a1dc30b499140fd66502d1f1',
    channelAccessToken: 'BUJPohDhLlJGGKLWH2qIFLZwZ2lzXePmVpOvXjvCTRR4ltmMmB59LFW6TruYBIbku/2Xn5PK/Wo2BY5OkwkrV8rDrKvkr6QSIx/C0F0icOZaa35V2i0fuLYyAFzQRln/Nnjdu82m8V7nYDGdoxwqNgdB04t89/1O/w1cDnyilFU='
};

// configuration ===========================================
const sslPath = '/etc/letsencrypt/live/www.fordicpro.io/';

const options = {  
   key: fs.readFileSync(sslPath + 'privkey.pem'),
   cert: fs.readFileSync(sslPath + 'fullchain.pem')
 };

const server = https.createServer(options,app);

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
  });
}

//app.listen(PORT);
server.listen(PORT);

console.log(`Server running at ${PORT}`);