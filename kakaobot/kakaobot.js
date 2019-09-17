const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const apiRouter = express.Router();

const port = process.env.PORT || 6000;
const host = process.env.HOST || 'www.fordicpro.io';
const fs = require('fs');
const https = require('https');
const request = require('request');


app.use(logger('dev', {}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api', apiRouter);

apiRouter.post('/sayHello', function(req, res) {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "hello I'm Ryan"
          }
        }
      ]
    }
  };

  res.status(200).send(responseBody);
});

apiRouter.post('/showHello', function(req, res) {
  console.log(req.body);

  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleImage: {
            imageUrl: "https://t1.daumcdn.net/friends/prod/category/M001_friends_ryan2.jpg",
            altText: "hello I'm Ryan"
          }
        }
      ]
    }
  };

  res.status(200).send(responseBody);
});

// app.listen(3000, function() {
//   console.log('Example skill server listening on port 3000!');
// });

// configuration ===========================================
const sslPath = '/etc/letsencrypt/live/www.fordicpro.io/';

const options = {  
   key: fs.readFileSync(sslPath + 'privkey.pem'),
   cert: fs.readFileSync(sslPath + 'fullchain.pem')
 };

https.createServer(options, app).listen( port, host, null, function() {
  console.log('Server listening on host %s,  port %d in %s mode', this.address().host, this.address().port, app.settings.env );
});