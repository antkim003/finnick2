'use strict';
var socketio = require('socket.io');
var io = null;
var Row = require('mongoose').model('Row');
var Cell = require('mongoose').model('Cell');
var _ = require('lodash');
var http = require('http');
var redis = require('redis');
var ioredis = require('socket.io-redis');
var url = require('url');

var isDeveloping = process.env.NODE_ENV !== 'production';
var isTestingServer = process.env.TESTING === 'testing';

// only enable redis cache layer when it's deployed
if (!isDeveloping) {
  var redisURL = url.parse(process.env.REDISCLOUD_URL || 'localhost:6379' );

  var pub = redis.createClient(redisURL.port, redisURL.hostname, {return_buffers: true});
  var sub = redis.createClient(redisURL.port, redisURL.hostname, {return_buffers: true});
  pub.auth(redisURL.auth.split(":")[1]);
  sub.auth(redisURL.auth.split(":")[1]);
  var redisOptions = {
    pubClient: pub,
    subClient: sub,
    host: redisURL.hostname,
    port: redisURL.port
  };
}

module.exports = function (server) {

    if (io) return io;

    io = socketio.listen(server);
    console.log('redis layer enabled! ', process.env.REDISCLOUD_URL);
    if (!isDeveloping) {
        io.adapter(ioredis(redisOptions));
    }

    var numUsers = 0;
    var currentUsers = [];

    io.on('connection', function (socket) {
        var addedUser = false;
        socket.broadcast.emit('user connected');

        socket.on('my other event', function (data) {
            console.log('now send to all browsers', data);
            var options = {
                port: process.env.PORT || 3000,
                path: '/api/rows/'
            };
            socket.broadcast.emit('new data', data);

            console.log(data);

        });
        socket.on('new data', function (data) {
            console.log('new data');
        });
        socket.on('user editing', function (data) {
            socket.broadcast.emit('other user editing', data);
        });
        socket.on('other user editing', function (data) {
            console.log('other user')
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

    });

    return io;

};
