/* eslint no-console: 0 */

const path = require('path');
const express = require('express');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const startDb = require('./db');
const app = require('./app');
const cluster = require('cluster');

const server = require('http').createServer();
let workers = process.env.WORKERS || require('os').cpus().length;

server.on('request', app);
require('./io')(server);

if (cluster.isMaster) {
  console.log('start cluster with %s workers', workers - 1);
  workers--;
  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork();
    console.log('worker %s started.', worker.process.pid);
  }

  cluster.on('death', function(worker) {
    console.log('worker %s died. restart...', worker.process.pid);
  });
} else {
  start();
}

function start() {

  server.listen(port, function onStart(err) {
    if (err) {
      console.log(err);
    }
    console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);

  });
}
