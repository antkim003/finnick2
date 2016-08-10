/* eslint no-console: 0 */

const path = require('path');
const express = require('express');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const startDb = require('./db');
const app = require('./app');
const sticky = require('socketio-sticky-session');
const options = {
  proxy: true,
  header: 'x-forwarded-for',
  num: 2,
  sync: {
    isSynced: true,
    event: 'mySyncEventCall'
  }
}

sticky(options, function() {
  const server = require('http').createServer(function(req, res) {
    console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  });
  server.on('request', app);
  require('./io')(server);
  return server;
}).listen(port, function() {
  console.log(`server started on ${port} port`);
});
