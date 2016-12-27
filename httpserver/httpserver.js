//Let's require/import http module
var http = require('http');

//Let define a port we want to listen to
const port = 8080;

function handle_request (request, response) {
  response.end ('it works! path hit: ' + request.url);
}

//Create a server
var server = http.createServer(handle_request);

//Let start our server
server.listen(port, function() {
  // Callback trigged when server is successfully listening
  console.log("server listening on http://localhost:%s", port);
})
