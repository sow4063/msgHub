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

// For LINE
const line = require('@line/bot-sdk');
const config = {
    channelSecret: 'bd318f73a1dc30b499140fd66502d1f1',
    channelAccessToken: 'at+fk6ySuxOJry9/Byrfx2iCp6zwX1eRCsJC8jv57Um4fN0PZB/2WhEWgeDACjitu/2Xn5PK/Wo2BY5OkwkrV8rDrKvkr6QSIx/C0F0icOb4Qi2NYZ8CqyuywVG2UJT7GWPnan8nqlqrjmMx1PELkAdB04t89/1O/w1cDnyilFU='
};
const client = new line.Client(config);

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

  // send to the fsbot
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": '1172651839508093'
    },
    "message": body.message
  }
  
  // Send the HTTP request to the Facebook Messenger Platform
  request({
    "uri": "https://www.fordicpro.io:4000/webhook",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent to Facebook Messenger!');
    } else {
      console.error("Unable to send message:" + err);
    }
  });

});

// Creates the endpoint for Fasebook BOT
app.post('/fsmsg', (req, res) => {  
 
  let body = req.body;

  console.log('body from FacebookBOT : ', body);

  // Construct the message body
  let request_body = {
    "recipient": {
      "token": ""
    },
    "message": body.response
  }

  // Send the HTTP request to the LINE Messenger Platform
  // request({
  //   "uri": "https://www.fordicpro.io:443/webhook",
  //   "method": "POST",
  //   "json": request_body
  // }, (err, res, body) => {
  //   if (!err) {
  //     console.log('message sent to LINE BOT!')
  //   } else {
  //     console.error("Unable to send message : " + err);
  //   }
  // });

  //return to LINE
  return client.replyMessage('', {
    type: 'text',
    text: body.response //実際に返信の言葉を入れる箇所
  });

});

