"use strict";
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');

module.exports = function (app) {
    var root = app.getValue('projectRoot');

    var distPath = path.join(root, './dist');

    app.use(favicon(app.getValue('faviconPath')));
    app.use(express.static(distPath));
    app.use('/bootstrap', express.static(path.join(root,'node_modules/bootstrap')));
    app.use('/socket.io-client',express.static(path.join(root,'node_modules/socket.io-client')));
    app.use('/jquery',express.static(path.join(root,'node_modules/jquery')));
};
