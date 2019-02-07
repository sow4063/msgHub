'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: 'bd318f73a1dc30b499140fd66502d1f1',
    channelAccessToken: '7AC4byPJ0jxG/nz07+H9t559afmMuk48EgYcs8GMlzA5MM1j3LASF4VTw3ddcpzDu/2Xn5PK/Wo2BY5OkwkrV8rDrKvkr6QSIx/C0F0icObazq03Dnx9CwTsoEY2xpCvEv98fMMm23+EcHvL5zpsuAdB04t89/1O/w1cDnyilFU='
};

const app = express();

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

app.listen(PORT);
console.log(`Server running at ${PORT}`);