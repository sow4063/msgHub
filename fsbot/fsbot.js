'use strict';

// Imports dependencies and set up http server
const PAGE_ACCESS_TOKEN = "EAAEW3BK980wBAJqt80yIzcGMrjynNynA4OkZAaaXPSfEfZCf7rNbWpQuDX4rMbGfOxzpLzfwvyLAYwZBvlxdM9L0jhssZCBPN3CwkWYYS4zBguXWUlNLeyDcTZCl2MhiVqZC6FiG6vr6BQ2eZCY0THggbbr9HzZC7bQ4PEXBPNfR3GcFfZAoE3ZCNu";

const
  express = require('express'),
  bodyParser = require('body-parser'),
  https = require('https'),
  port = process.env.PORT || 4000,
  fs = require('fs'),
  host = process.env.HOST || 'www.fordicpro.io',
  request = require('request'),
  app = express().use(bodyParser.json()); // creates express http server

// configuration ===========================================
const sslPath = '/etc/letsencrypt/live/www.fordicpro.io/';

const options = {  
   key: fs.readFileSync(sslPath + 'privkey.pem'),
   cert: fs.readFileSync(sslPath + 'fullchain.pem')
 };

// Sets server port and logs message on success
//app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
https.createServer(options, app).listen( port, host, null, function() {
  console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env );
});

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "sow4063"

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
});

// Handles messages events
function handleMessage(sender_psid, received_message) {

	let response;

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}".`
    }
  }  
  
  // Sends the response message
  callSendAPI(sender_psid, response); 

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

	// Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://www.fordicpro.io:5000/fsmsg",
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent to hub server!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
  
}


