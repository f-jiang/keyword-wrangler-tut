// to create migration file: 
// ./node_modules/.bin/db-migrate create createKeywordAndCategoryTable --env test

// to run db migration:
// ./node_modules/.bin/db-migrate up --env test

// to run a test with auto db migrations:
// ./node_modules/.bin/db-migrate up --env test && ./node_modules/.bin/jasmine-node --verbose --captureExceptions ./spec/

/*db migration workflow:
    1. changes in code reflect new db structure
    2. create new migration file (1st command)
    3. add db changes to migration file generated in previous step
    4. remove old, manually created tables if needed ('rm' command)
    5. run migration and update db (2nd command)
    6. ready for testing
*/

'use strict';

var Server = require('./server.js').Server; // contains 'Server()' function from server.js

// setting up the server is now donw in server.js
var server = Server('8080'); // get a server object from the Server() function

// start the server (ie begin listening to requests)
server.listen(function() {
	console.log('Server started and listening on port', server.options.port);
});
