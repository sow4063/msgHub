// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');

//const https_port = process.env.PORT || 3978;
const port = process.env.PORT || 3978;
const fs = require('fs');
const host = process.env.HOST || 'www.fordicpro.io';

const
  express = require('express'),
  bodyParser = require('body-parser'),
  https = require('https'),
  request = require('request'),
  app = express().use(bodyParser.json()); // creates express http server


// configuration ===========================================
const sslPath = '/etc/letsencrypt/live/www.fordicpro.io/';

const options = {  
   key: fs.readFileSync(sslPath + 'privkey.pem'),
   cert: fs.readFileSync(sslPath + 'fullchain.pem')
 };

 https.createServer(options, app).listen( port, host, null, function() {
  console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env );
});

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');

// This bot's main dialog.
const { MyBot } = require('./bot');

// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

// Create HTTP server
// const server = restify.createServer();
// server.listen(port,host, () => {
//     console.log(`\n${ server.name } listening to ${ server.url }`);
//     console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
//     console.log(`\nTo test your bot, see: https://aka.ms/debug-with-emulator`);
// });

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId || '39b991d8-6b43-4086-8aca-329775f433f3',
    appPassword: process.env.MicrosoftAppPassword || 'o-z4p/qSW@3A+P8RiZf0T]wS[Qr4.zMW'
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user
    await context.sendActivity(`Oops. Something went wrong!`);
};

// Create the main dialog.
const myBot = new MyBot();

// Listen for incoming requests.
//https_server.post('/api/messages', (req, res) => {
app.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await myBot.run(context);

        // request to hub server.
        console.log('context input' + context );
        
        // Construct the message body
        let request_body = {
          "recipient": {
            "id": context.activity.recipient.id
          },
          "message": context.activity.text
        }

        // Send the HTTP request to the Messenger Platform
        request({
          "uri": "https://www.fordicpro.io:5000/skypemsg",
          "method": "POST",
          "json": request_body
        }, (err, res, body) => {
          if (!err) {
            console.log('message sent!')
          } 
          else {
            console.error("Unable to send message:" + err);
          }
        });
    });
});
