'use strict';
var socketio = require('socket.io');
var io = null;
var Row = require('mongoose').model('Row');
var Cell = require('mongoose').model('Cell');
var _ = require('lodash');
var http = require('http');

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);


    var numUsers = 0;
    var currentUsers = [];

    io.on('connection', function (socket) {

        var addedUser = false;


        console.log('io connection on');
        socket.on('my other event', function (data) {
//            console.log(data);
            console.log('now send to all browsers', data);
//            socket.broadcast.emit('new data', data);
            var options = {
                port: process.env.PORT || 3000,
                path: '/api/rows/'
            };
//            http.get(options, function(response){
//                var body = '';
//                response.on('data', function(chunk) {
//                    body += chunk;
//                });
//                response.on('end', function() {
                    socket.broadcast.emit('new data', data);
//                    socket.emit('new data', body);

                    console.log(data);
//                });
//                socket.broadcast.emit('new data', response);
//            });
//            socket.emit('new data', data);

        });
        socket.on('new data', function (data) {
            console.log('new data');
        });
        socket.on('user editing', function (data) {
            socket.broadcast.emit('other user editing', data);

//            socket.emit('new data', data);
//            socket.broadcast.emit('user editing', data);
        });
        socket.on('other user editing', function (data) {
            console.log('other user')
//            var options = {
//                port: 3000,
//                path: '/api/rows/women'
//            };
//            http.get(options, function(response){
//                var body = '';
//                response.on('data', function(chunk) {
//                    body += chunk;
//                });
//                response.on('end', function() {
//                    socket.emit('new data', body)
//                });
//            });
        });
        socket.broadcast.emit('user connected');




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

    });

    return io;

};
