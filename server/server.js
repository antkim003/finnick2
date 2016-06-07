/* eslint no-console: 0 */

const path = require('path');
const express = require('express');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const startDb = require('./db');
const app = require('./app');
const server = require('http').createServer();

server.on('request', app);
require('./io')(server);

server.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);

});
// app.prototype.listen = function() {
//     this.listeningApp.listen.apply(this.listeningApp, arguments);\
// };

//var server = require('http').Server(app);
//var io = require('socket.io')(server);
////server.listen(port);
//
//io.on('connection', function (socket) {
//    console.log('connected');
//
////        socket.emit('news', { hello: 'world' });
//    socket.on('my other event', function (data) {
////            console.log(data);
////            socket.emit('sendtoclient', data);
//        console.log('now send to all browsers',data);
//        socket.broadcast.emit('new message', data);
////            socket.emit('news',data);
//    });
//    socket.on('news', function(data) {
////            console.log(data);
//        socket.emit('my other event', { hello: 'world' });
//    });
//    socket.broadcast.emit('user connected')
//});
