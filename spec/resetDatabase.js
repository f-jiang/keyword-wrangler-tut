'use strict';

var async = require('async');

var resetDatabase = function(dbSession, callback) {
	async.series(  // clear all rows in keyword and category tables
	    [
		function(callback) {
			dbSession.remove('keyword', '1', function(err) {
				callback(err);
			});
		},
		function(callback) {
			dbSession.remove('category', '1', function(err) {
				callback(err);
			});
		}
	    ],
	    function(err, results) {
	        callback(err);
	    }
	);
};

module.exports = resetDatabase;
