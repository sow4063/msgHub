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

// Creates the endpoint for SKYPEBOT
app.post('/skypemsg', (req, res) => {  
  let body = req.body;

  console.log('body from SKYPEBOT : ', body );

  let response = {
    "text": body.message
  }

  // send to the skypebot
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": "1172651839508093"
    },
    "message": {
      "text": body.message
    }
  }

  console.log('message sending from SKYPE To FB : ', request_body.message);
  
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
      return res.statusCode;
    } 
    else {
      console.error("Unable to send message:" + err);
    }
  });

  // to : jongik in LINE Messenger
  const client = new line.Client(config);

  const message = {
    type: 'text',
    text: body.message
  };

  console.log('message sending From SKYPEBOT to LINE! : ' + message.text );

  // to : jongik in LINE Messenger
  client.pushMessage('Ubc8bd3232c94987ce1f01e2043f246a5', message)
    .then(() => {
      console.log('SUCCESS');
    })
    .catch((err) => {
      console.error("Error : " + err );
    });

});

// Creates the endpoint for LINEBOT
app.post('/linemsg', (req, res) => {  
 
  let body = req.body;

  console.log('body from LINEBOT : ', body );

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
      "text": body.message
    }
  }

  console.log('message LINE To FB : ', request_body.message);
  
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
      // Returns a '200 OK' response to all requests
      return res.statusCode;
    } else {
      console.error("Unable to send message:" + err);
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

  // to : Skype Messenger
  let request_body = {
    recipient: { 
      id: '29:18HAr90YesQ7UVwCivYr1jW6BfBG_6rBnN6AS0jliOo8',
      name: 'sow4063_skypebot'
    },
    type: 'message',
    timestamp: "2019-09-26T10:38:13.291Z",
    id:'1569494293285',
    channelId: 'skype',
    serviceUrl: 'https://smba.trafficmanager.net/apis/',
    from: { 
      id: '29:18HAr90YesQ7UVwCivYr1jW6BfBG_6rBnN6AS0jliOo8',
      name: 'Jongik Lee' 
    },
    conversation: { 
      id: '29:18HAr90YesQ7UVwCivYr1jW6BfBG_6rBnN6AS0jliOo8' 
    },
    text: body.message.text,
  }

  console.log('message sending From Facebook Messenger to Skypebot! : ' + message.text );

  request({
    "uri": "https://www.fordicpro.io:3978/api/messages",
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sending From Facebook Messenger to Skypebot!');
      // Returns a '200 OK' response to all requests
      return res.statusCode;
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 

});

