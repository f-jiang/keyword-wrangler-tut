'use strict';

var Percolator = require('percolator').Percolator;

var port = 8080;
var server = Percolator({'port': port});

server.route('/api/keywords', {
	GET: function(req, res) {
		res.object({'foo': 'bar'}).send();
	}
});

server.listen(function() {
	console.log('Server started and listening on port', port);
});
