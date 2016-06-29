'use strict';

var Server = require('./server.js').Server; // contains 'Server()' function from server.js

// setting up the server is now donw in server.js
var server = Server('8080'); // get a server object from the Server() function

// start the server (ie begin listening to requests)
server.listen(function() {
	console.log('Server started and listening on port', server.options.port);
});
