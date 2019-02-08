var express = require('express');
var https = require('https');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');

// configuration ===========================================
var sslPath = '/etc/letsencrypt/live/www.fordicpro.com/';

// var options = {  
//   key: fs.readFileSync(sslPath + 'privkey.pem'),
//   cert: fs.readFileSync(sslPath + 'fullchain.pem')
// };

var host = process.env.HOST || 'www.fordicpro.com';
var port = process.env.PORT || 4000;

// get all data/stuff of the body (POST) parameters
app.use( bodyParser.json() ); // parse application/json 
app.use( bodyParser.json({ type: 'application/vnd.api+json' }) ); // parse application/vnd.api+json as json
app.use( bodyParser.urlencoded({ extended: true }) ); // parse application/x-www-form-urlencoded

// routes ==================================================
require('./app/router')(app); // pass our application into our routes

// start app ===============================================
//https.createServer(options, app).listen( port, host, null, function() {
var server = app.listen(port, function(){	
  console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env );
});