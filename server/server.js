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
