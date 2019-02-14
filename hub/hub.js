'use strict';

const
  express = require('express'),
  bodyParser = require('body-parser'),
  https = require('https'),
  port = process.env.PORT || 5000,
  fs = require('fs'),
  host = process.env.HOST || 'www.fordicpro.io',
  request = require('request'),
  app = express().use(bodyParser.json()); // creates express http server

// For Facebook Messenger : Imports dependencies and set up http server
const PAGE_ACCESS_TOKEN = "EAAEW3BK980wBAJqt80yIzcGMrjynNynA4OkZAaaXPSfEfZCf7rNbWpQuDX4rMbGfOxzpLzfwvyLAYwZBvlxdM9L0jhssZCBPN3CwkWYYS4zBguXWUlNLeyDcTZCl2MhiVqZC6FiG6vr6BQ2eZCY0THggbbr9HzZC7bQ4PEXBPNfR3GcFfZAoE3ZCNu";
const FBMessenger = require('fb-messenger');

// For LINE
const line = require('@line/bot-sdk');
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

// Sets server port and logs message on success
https.createServer(options, app).listen( port, host, null, function() {
  console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env );
});

// Creates the endpoint for LINEBOT
app.post('/linemsg', (req, res) => {  
 
  let body = req.body;

  console.log('body from LINEBOT : ', body);

  let response = {
    "text": body.message
  }

  // send to the fsbot
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": "1172651839508093"
    },
    "message": {
      "text": "test send msg"
    },
    "messaging_type": "MESSAGE_TAG",
    "tag": "firsts greet",
    "notification_type": "REGULAR"
  }

  //ヘッダーを定義
  var headers = {
    'Content-Type':'application/json'
  }

  //オプションを定義
  var options = {
    url: 'https://graph.facebook.com/v2.6/me/messages',
    method: 'POST',
    headers: headers,
    json: true,
    body: request_body
  }

  console.log('message LINE To FB : ', request_body.message);
  
  // Send the HTTP request to the Facebook Messenger Platform
  // Send the HTTP request to the Messenger Platform

  //const messenger = new FBMessenger({token: PAGE_ACCESS_TOKEN});
  //messenger.sendTextMessage({id: '1172651839508093', text: 'Hello'});
  
  // request({
  //   "uri": "https://graph.facebook.com/v2.6/me/messages",
  //   "qs": { "access_token": PAGE_ACCESS_TOKEN },
  //   "method": "POST",
  //   "json": request_body
  // }, (err, res, body) => {
  //   if (!err) {
  //     console.log('SUCCESS!');
  //   } else {
  //     console.error("Error - Unable to send message : " + err);
  //   }
  // });

  let url = "https://graph.facebook.com/v2.6/me/messages?access_token="
  url += PAGE_ACCESS_TOKEN;

  let send_body = {
    "recipient":{
      "id": "1172651839508093"
    },
    //"messaging_type": "MESSAGE_TAG",
    //"tag": "TRANSPORTATION_UPDATE",
    "notification_type": "REGULAR"
    "message": {
      "text": body.message
  }

  request({
    "uri": url,
    "method": "POST",
    "body": send_body
  }, (err, res, body) => {
    if (!err) {
      console.log('SUCCESS!');
    } else {
      console.error("Error - Unable to send message : " + err);
    }
  });

});

// Creates the endpoint for Fasebook BOT
app.post('/fsmsg', (req, res) => {  
 
  let body = req.body;

  console.log('body from FacebookBOT : ', body);

  const client = new line.Client(config);

  const message = {
    type: 'text',
    text: body.message.text
  };

  console.log('message sending From Facebook Messenger to LINE! : ' + message.text );

  // to : jongik in LINE Messenger
  client.pushMessage('Ubc8bd3232c94987ce1f01e2043f246a5', message)
    .then(() => {
      console.log('SUCCESS');
    })
    .catch((err) => {
      console.error("Error : " + err );
    });

});

