'use strict';
var socketio = require('socket.io');
var io = null;
var Row = require('mongoose').model('Row');
var Cell = require('mongoose').model('Cell');
var _ = require('lodash');
var http = require('http');
var Promise = require('bluebird');

// var redis = require('redis');
// var ioredis = require('socket.io-redis');
var url = require('url');

var isDeveloping = process.env.NODE_ENV !== 'production';
var isTestingServer = process.env.TESTING === 'testing';

module.exports = function (server) {

    if (io) return io;

    io = socketio.listen(server);
    // if (!isDeveloping) {
    //     io.adapter(ioredis(redisOptions));
    // }

    var numUsers = 0;
    var currentUsers = [];

    io.on('connection', function (socket) {
        var addedUser = false;
        socket.broadcast.emit('user connected');

        socket.on('my other event', function (data) {
            var options = {
                port: process.env.PORT || 3000,
                path: '/api/rows/'
            };
            socket.broadcast.emit('new data', data);
        });
        socket.on('user editing', function (data) {
            socket.broadcast.emit('other user editing', data);
        });
        socket.on('add user', function (username) {
            if (addedUser) return;
            currentUsers.push(username);
            currentUsers = _.uniqBy(currentUsers, 'username')
            // we store the username in the socket session for this client
            socket.username = username;
            ++numUsers;
            addedUser = true;
            socket.emit('login', {
                numUsers: numUsers,
                currentUsers: currentUsers
            });
            // echo globally (all clients) that a person has connected
            socket.broadcast.emit('user joined', {
                username: socket.username,
                numUsers: numUsers,
                currentUsers: currentUsers
            });

        });

        socket.on('disconnect', function () {
            if (addedUser) {
                --numUsers;
                currentUsers = _.uniqBy( _.without(currentUsers, socket.username), 'username' );

                // echo globally that this client has left
                socket.broadcast.emit('user left', {
                    username: socket.username,
                    numUsers: numUsers,
                    currentUsers: currentUsers
                });
            }
        });


        socket.on('getcombo', function () {
            var start = new Date();
            var arr = [];
            var _rows;
            Row.find().lean().populate('entries').then(function(rows) {
                _rows = rows;
                var categoriesarr = [
                    {"women": []},
                    {"men": []},
                    {"kids": []},
                    {"shoes": []},
                    {"jewlery&watches": []},
                    {"handbags&accessories": []},
                    {"juniors": []},
                    {"beauty": []},
                    {"for_the_home": []},
                    {"kitchen&dining": []},
                    {"bed&bath": []},
                    {"luggage&accessories": []},
                    {"furniture&mattresses": []},
                    {"IntlWomen": []},
                    {"intlmen": []},
                    {"intlkids": []},
                    {"intlshoes": []},
                    {"intljewelry&Watches": []},
                    {"intlhandbags&Accessories": []},
                    {"intljuniors": []},
                    {"intlforthehome": []},
                    {"intlkitchen&dining": []},
                    {"intlbed&bath": []},
                    {"intlluggage&accessories": []}
                ]
                arr = categoriesarr;
                var keys = new Date() - start;
                console.info("Execution keys time: %dms", keys);
                return categoriesarr;
            }).then(function(obj) {
                _.each(obj, function(main,idx){
                    _.each(_rows, function(row,idx2) {
                        if (row.fob == Object.keys(main)[0]) {
                            var newentries = [];
                            _.each(row.entries, function(e, i){
                                var newobj = {};
                                //which columns needed for display?
                                //name
                                //copy
                                //price
                                //image
//                        newobj[e.columnName] = e.data;
                                if (Object.keys(main)[0] != 'women' && Object.keys(main)[0] != 'IntlWomen'){
                                    if (e.columnName == 'bffavorites' ||
                                        e.columnName == 'extra' ||
                                        e.columnName == 'extraomniprojectedsales' ||
                                        e.columnName == 'featureproductid' ||
                                        e.columnName == 'instorespecial' ||
                                        e.columnName == 'livedate' ||
                                        e.columnName == 'markettointernational' ||
                                        e.columnName == 'needsavedset' ||
                                        e.columnName == 'notesfrombuyersimg' ||
                                        e.columnName == 'notesfromretouchimg' ||
                                        e.columnName == 'notesoncategory' ||
                                        e.columnName == 'plenti' ||
                                        e.columnName == 'projectedunits' ||
                                        e.columnName == 'salesfor2015' ||
                                        e.columnName == 'singleormultiple' ||
                                        e.columnName == 'savedsetid' ||
                                        e.columnName == 'pricingcomments' ||
                                        e.columnName == 'alsoinpetites' ||
                                        e.columnName == 'petitescategoryid' ||
                                        e.columnName == 'petiteslinktype' ||
                                        e.columnName == 'petitesproductid' ||
                                        e.columnName == 'petitessavedset' ||
                                        e.columnName == 'petitesurl'
                                        ) {
                                        delete row.entries[i];
                                    } else {
                                        newobj[e.columnName] = e.data;
                                        row.entries[i] = newobj;
                                    }
                                } else {
                                    if (e.columnName == 'bffavorites' ||
                                        e.columnName == 'extra' ||
                                        e.columnName == 'extraomniprojectedsales' ||
                                        e.columnName == 'featureproductid' ||
                                        e.columnName == 'livedate' ||
                                        e.columnName == 'markettointernational' ||
                                        e.columnName == 'needsavedset' ||
                                        e.columnName == 'notesfrombuyersimg' ||
                                        e.columnName == 'notesfromretouchimg' ||
                                        e.columnName == 'notesoncategory' ||
                                        e.columnName == 'plenti' ||
                                        e.columnName == 'projectedunits' ||
                                        e.columnName == 'salesfor2015' ||
                                        e.columnName == 'singleormultiple' ||
                                        e.columnName == 'savedsetid' ||
                                        e.columnName == 'pricingcomments'

                                        ) {
                                        delete row.entries[i];
                                    } else {
//                                if (e.columnName == 'doubleexposure') {
//                                    row.doubleexposure = e.data;
//                                }
//                                if (e.columnName == 'doubleexposure2') {
//                                    row.doubleexposure2 = e.data;
//                                }
                                        newobj[e.columnName] = e.data;
                                        row.entries[i] = newobj;
                                    }
                                }

                                row.updatedAt = undefined;
                                row.createdAt = undefined;
                                row.__v = undefined;
                                row.locked = undefined;

                                if (e.columnName == 'killedrow') {
                                    if (e.data == 'true') {
                                        row.killed = 'KILLED';
                                    }
                                }

                                if (i == row.entries.length-1){
                                    row.entries = _.compact(row.entries);


                                    //pushing row to fob array
                                    if (row.killed != 'KILLED') {
                                        main[row.fob].push(row);
                                    }


                                    //delete if killed?
//                            _.find(_.map(row.entries, 'killedrow'), function(val) {
//                                if (val == 'true') {
//                                    console.log(val);
//                                } else {
//                                    main[row.fob].push(row);
//                                }
//                            });


                                    _.each(_.map(row.entries, 'doubleexposure'), function(val,i) {
                                        if (val) {
                                            var result = arr.filter(function( obj ) {
                                                return obj[val];
                                            });
                                            _.map(result, val)[0].push(row);
//                                    console.log(_.map(result, val)[0].length)
                                        }
                                    })

                                    _.each(_.map(row.entries, 'doubleexposure2'), function(val,i) {
                                        if (val) {
                                            var result = arr.filter(function( obj ) {
                                                return obj[val];
                                            });
                                            _.map(result, val)[0].push(row);
//                                    console.log(_.map(result, val)[0].length)
                                        }
                                    })

                                    _.each(_.map(row.entries, 'doubleexposure3'), function(val,i) {
                                        if (val) {
                                            var result = arr.filter(function( obj ) {
                                                return obj[val];
                                            });
                                            _.map(result, val)[0].push(row);
//                                    console.log(_.map(result, val)[0].length)
                                        }
                                    })

                                }
                            })
                        }
                    })
                })
            }).then(function() {
                var end = new Date() - start;
                console.info("Execution time: %dms", end);
                socket.emit('donegetcombo', arr);
//                res.json(arr);
            })
        })

    });
    module.exports.testserver = io;
    return io;

};
