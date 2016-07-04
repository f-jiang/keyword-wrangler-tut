// to test enter ./node_modules/.bin/jasmine-node --verbose --captureExceptions ./spec/
'use strict';

var request = require('request');
var dbSession = require('../../src/backend/dbSession.js');
var Server = require('../../src/backend/server.js').Server;
var resetDatabase = require('../resetDatabase.js');
var async = require('async');

describe('The API', function() {
    var server;
    
    // restart the server and db before each test
    beforeEach(function(done) {
        server = Server('8081');    // 8081 for testing, 8080 for production
        server.listen(function (err) {
            resetDatabase(dbSession, function() {
                done(err);
            });
        });
    });
    
    // close server and reset db after each test
    afterEach(function(done) {
        server.close(function() {
            resetDatabase(dbSession, function() {
                done();
            });
        });
    });
    
	it('should respond to a GET request at /api/keywords/', function(done) {
		var expected = {
			'_items': [
				{'id': 1, 'value': 'Aubergine', 'categoryID': 1},
				{'id': 2, 'value': 'Onion', 'categoryID': 1},
				{'id': 3, 'value': 'Knife', 'categoryID': 2}
			]
		};

		async.series(
			[
                function(callback) {
                    resetDatabase(dbSession, callback);  
                },
				function(callback) {    // insert rows
					dbSession.insert(
						'keyword',
						{'value': 'Aubergine', 'categoryID': 1},
						function(err) { callback(err); }
					);
				},
				function(callback) {
					dbSession.insert(
						'keyword',
						{'value': 'Onion', 'categoryID': 1},
						function(err) { callback(err); }
					);
				},
				function(callback) {
					dbSession.insert(
						'keyword',
						{'value': 'Knife', 'categoryID': 2},
						function(err) { callback(err); }
					);
				}
			],
			function(err, results) {
                if (err) throw(err);
				request.get(    // send GET request
					{
						'url': 'http://localhost:8081/api/keywords/', // directed at this address (same one as in index.js)
						'json': true
					},
					function(err, res, body) {
						expect(res.statusCode).toBe(200);
						expect(body).toEqual(expected);
						done();
					}
				);
			}
		);
	});
    
    it('should respond to a GET request at /api/keywords/categories/', function(done) {
        var expected = {
            '_items': [
                {'id': 1, 'name': 'Vegetable'},
                {'id': 2, 'name': 'Utility'}
            ]
        };
        
        async.series(
            [
                function(callback) {
                    resetDatabase(dbSession, callback);
                },
                function(callback) {
                    dbSession.insert(
                        'category',
                        {'name': 'Vegetable'},
                        function(err) { callback(err); }
                    );
                },
                function(callback) {
                    dbSession.insert(
                        'category',
                        {'name': 'Utility'},
                        function(err) { callback(err); }
                    );
                }                
            ],
            function(err, results) {
                if (err) throw(err);
                request.get(
                    {
                        'url': 'http://localhost:8081/api/keywords/categories/',
                        'json': true
                    },
                    function(err, res, body) {
                        expect(res.statusCode).toBe(200);
                        expect(body).toEqual(expected);
                        done();
                    }
                );
            }
        );
    });
    
    it('should create a new keyword when receiving a POST request at /api/keywords/', function(done) {
        var expected = {
           '_items': [
               {'id': 1, 'value': 'Aubergine', 'categoryID': 1},{'id': 2, 'value': 'Onion', 'categoryID': 1}
           ]
        };
        
        var body = {
            'value': 'Onion',
            'categoryID': 1
        };
        
        async.series(
            [
                function(callback) {
                    dbSession.insert(
                        'category',
                        {'name': 'Vegetable'},
                        function(err) { callback(err); }
                    );
                },
                function(callback) {
                    dbSession.insert(
                        'keyword',
                        {'value': 'Aubergine', 'categoryID': 1},
                        function(err) { callback(err); }
                    );
                }
            ],
            function(err, results) {
                if (err) throw(err);
                request.post(
                    {
                        'url': 'http://localhost:8081/api/keywords/',
                        'body': body,
                        'json': true
                    },
                    function(err, res, body) {
                        if (err) throw(err);
                        expect(res.statusCode).toBe(200);
                        request.get(
                            {
                                'url': 'http://localhost:8081/api/keywords/',
                                'json': true
                            },
                            function(err, res, body) {
                                expect(res.statusCode).toBe(200);
                                expect(body).toEqual(expected);
                                done();
                            }
                        );
                    }
                );
            }
        );
    });
});
