'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const port = process.env.PORT || 443;
const host = process.env.HOST || 'www.fordicpro.io';
const fs = require('fs');
const https = require('https');
const app = express();
const request = require('request');

const config = {
    channelSecret: 'bd318f73a1dc30b499140fd66502d1f1',
    channelAccessToken: 'at+fk6ySuxOJry9/Byrfx2iCp6zwX1eRCsJC8jv57Um4fN0PZB/2WhEWgeDACjitu/2Xn5PK/Wo2BY5OkwkrV8rDrKvkr6QSIx/C0F0icOb4Qi2NYZ8CqyuywVG2UJT7GWPnan8nqlqrjmMx1PELkAdB04t89/1O/w1cDnyilFU='
};

// configuration ===========================================
const sslPath = '/etc/letsencrypt/live/www.fordicpro.io/';

const options = {  
   key: fs.readFileSync(sslPath + 'privkey.pem'),
   cert: fs.readFileSync(sslPath + 'fullchain.pem')
 };

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

  // request to hub server.
  // Construct the message body
  let request_body = {
    "recipient": {
      "token": event.replyToken
    },
    "message": event.message.text
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://www.fordicpro.io:5000/linemsg",
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });

  // return to LINE
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
  });
}

//app.listen(PORT);

https.createServer(options, app).listen( port, host, null, function() {
  console.log('Server listening on host %s,  port %d in %s mode', this.address().host, this.address().port, app.settings.env );
});
