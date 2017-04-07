var five = require("johnny-five");
var board = new five.Board();
var path = require('path');
var express = require('express');

const app = express();

// check NODE_ENV environment variable
var devMode = app.get('env') === 'development';

// Have the server serve the dist / production version or the development version
var rootFolder = devMode? '.' : 'dist';
app.use(express.static(rootFolder));

// Have all other routes forward to regular front end
const indexPath = path.join(__dirname, `../${devMode? '' : 'dist/'}index.html`);
app.get('/*', function(req, res) {
  res.sendFile(indexPath);
});

const listener = app.listen(process.env.PORT|3000, function () {
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
