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

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  console.log(body);

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  console.log(req);
});

