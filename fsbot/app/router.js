var request = require('request');

function verificationHandler(req, res) {

	sendHelp('sow4063');
  
  console.log('req.body ===>> ', req.body );
  console.log('req.query ===>> ', req.query );
  
  if( req.query['hub.verify_token'] == 'verifycode' ) {
    res.send( req.query['hub.challenge'] );
  }
  else {
  	res.send('Error, wrong validation token');
  }



};

function handleMessage(req, res) {

	console.log('req.body', req.body );
	console.log('req.query', req.query );

  var messaging_events = req.body.entry[0].messaging;

  for( var i = 0; i < messaging_events.length; i++ ) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;

    if( event.message && event.message.text ) {
      console.log('event.message.text ===>>> ', event.message.text );

      sendHelp(sender);
    }

  }

  res.send('received!!');
  

};

var url = "https://graph.facebook.com/v2.6/me/messages?access_token=EAAEW3BK980wBAGmaspHi5ZC4H4pua4xQiZClvtVOfYBZCZBgwrvDKaYN8dDlubFMS9nS7sMRcmxkLq1PIIwonVMkCHY2jVntZC3LGDTIBPnBVFZBIUgbEPMZCp6FBZCmdcCpVB1YbTItWLqp6T50wZARfVDjYLgEBzh83dZACBccQFtrAfhtrpfFmk" //replace with your page token

function sendHelp(id) {
  var options = {
    uri: url,
    method: 'POST',
    json: {
      "recipient": {
        "id": id
      },
      "message": {
        "text": "Send test message from server..."
      }
    }
  }
  request(options, function(error, response, body) {
    if (error) {
      console.log(error.message);
    }
  });
};

module.exports = function(app) {
	// server routes ===========================================================
	// handle things like api calls
	app.get('/', verificationHandler );

	app.post('/', handleMessage );

};
