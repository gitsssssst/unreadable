const five = require("johnny-five");
const board = new five.Board();
const path = require('path');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

// check NODE_ENV environment variable
var devMode = app.get('env') === 'development';

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Have the server serve the dist / production version or the development version
var rootFolder = devMode? '.' : 'dist';
app.use(express.static(rootFolder));

// Have all other routes forward to regular front end
const indexPath = path.join(__dirname, `../${devMode? '' : 'dist/'}index.html`);
app.get('/*', function(req, res) {
  res.sendFile(indexPath);
});

wss.on('connection', function connection(ws) {
  // const location = url.parse(ws.upgradeReq.url, true);
  console.log('connection');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.send('something');
});

const listener = server.listen(process.env.PORT|3000, function () {
  console.log('Example app listening on ', listener.address().port);
});

board.on("ready", function() {
  console.log('ready');
  var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  });

  // proximity.on("data", function() {
  //   console.log("Proximity: ");
  //   console.log("  cm  : ", this.cm);
  //   console.log("  in  : ", this.in);
  //   console.log("-----------------");
  // });
  //
  // proximity.on("change", function() {
  //   console.log("The obstruction has moved.");
  // });
});
