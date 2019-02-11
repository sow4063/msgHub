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

// Creates the endpoint for LINEBOT
app.post('/linemsg', (req, res) => {  
 
  let body = req.body;

  console.log('body from LINEBOT : ', body);

});

// Creates the endpoint for FasebookBOT
app.post('/fsmsg', (req, res) => {  
 
  let body = req.body;

  console.log('body from FacebookBOT : ', body);

});

