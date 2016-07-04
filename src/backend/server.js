'use strict';

var Percolator = require('percolator').Percolator;
var dbSession = require('../../src/backend/dbSession.js');

var Server = function(port) {
    var server = Percolator({'port': port, 'autoLink': false, 'staticDir': __dirname + '/../frontend'});

    server.route('/api/keywords', {
        GET: function(req, res) {
            dbSession.fetchAll(
                'SELECT id, value, categoryID FROM keyword ORDER BY id',
                function(err, rows) {
                    if (err) {
                        console.log(err);
                        res.status.internalServerError(err);
                    } else {
                        res.collection(rows).send();
                    }
                }
            );
        },
        POST: function(req, res) {
            req.onJson(function(err, newKeyword) {
                if (err) {
                    console.log(err);
                    res.status.internalServerError(err);
                } else {
                    dbSession.query(
                        'INSERT INTO keyword (value, categoryID) VALUES (?, ?);',
                        [newKeyword.value, newKeyword.categoryID],
                        function(err, result) {
                            if (err) {
                                console.log(err);
                                res.status.internalServerError(err);
                            } else {
                                res.object({'status': 'ok', 'id': result.insertId}).send();
                            }
                        }
                    );
                }
            })
        }
    });
    
    server.route('/api/keywords/categories', {
        GET: function(req, res) {
            dbSession.fetchAll(
                'SELECT id, name FROM category ORDER BY id',
                function(err, rows) {
                    if (err) {
                        console.log(err);
                        res.status.internalServerError(err);
                    } else {
                        res.collection(rows).send();
                    }
                }
            );
        }
    });
        
    return server;
};

module.exports = {'Server': Server};
