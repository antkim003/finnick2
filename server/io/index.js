'use strict';
var socketio = require('socket.io');
var io = null;
var Row = require('mongoose').model('Row');
var Cell = require('mongoose').model('Cell');
var _ = require('lodash');

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        console.log('io connection on');
        socket.on('my other event', function (data) {
            console.log(data);
            console.log('now send to all browsers', data);
//            var datanew = [];
//            Row.find().populate('entries').then(function(rows) {
//                var filteredrows = _.filter(rows, function(e){ return e.entries[_.findIndex(e.entries, function(eb){ return eb.columnName == 'category' } )].data == req.params.category })
////                res.json(filteredrows);
//                datanew = filteredrows;
//            });
            socket.broadcast.emit('new data', data);
        });
        socket.on('new data', function (data) {
            console.log('new data');
//            socket.emit('my other event', { hello: 'world' });
        });
        socket.on('user editing', function (data) {
            socket.broadcast.emit('other user editing', data);
//            socket.emit('user editing', data);
//            socket.broadcast.emit('user editing', data);
        });
        socket.on('other user editing', function (data) {
            console.log('other user')
        });
        socket.broadcast.emit('user connected');
    });
    
    return io;

};
