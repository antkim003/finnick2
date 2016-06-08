'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        console.log('io connection on');
        socket.on('my other event', function (data) {
        //            console.log(data);
        //            socket.emit('sendtoclient', data);
            console.log('now send to all browsers', data);
            socket.broadcast.emit('new message', data);
        //            socket.emit('news',data);
        });
        socket.on('news', function (data) {
        //            console.log(data);
            socket.emit('my other event', { hello: 'world' });
        });
        socket.broadcast.emit('user connected');
    });
    
    return io;

};
