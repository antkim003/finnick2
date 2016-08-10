'use strict';
const socketio = require('socket.io');
let io = null;
const Row = require('mongoose').model('Row');
const Cell = require('mongoose').model('Cell');
const _ = require('lodash');
const http = require('http');
let redis = require('redis');
let ioredis = require('socket.io-redis');
const url = require('url');

const isDeveloping = process.env.NODE_ENV !== 'production';
const isTestingServer = process.env.TESTING === 'testing';
console.log('is developing? ', isDeveloping);
if (!isDeveloping) {
  const redisURL = url.parse(process.env.REDISCLOUD_URL || 'localhost:6379' );

  const pub = redis.createClient(redisURL.port, redisURL.hostname, {return_buffers: true});
  const sub = redis.createClient(redisURL.port, redisURL.hostname, {return_buffers: true});
  pub.auth(redisURL.auth.split(":")[1]);
  sub.auth(redisURL.auth.split(":")[1]);
  const redisOptions = {
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
