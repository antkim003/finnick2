'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Cell = require('mongoose').model('Cell');
var Promise = require('bluebird');
var fs = require("fs"),
    util = require("util");
var http = require('http');

var mime = require("mime");

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', ensureAuthenticated, function (req, res, next) {
    Cell.find().then(function(cells) {
        res.json(cells);
    });
});

function base64Image(src) {
    var data = fs.readFileSync(src).toString("base64");
    return util.format("data:%s;base64,%s", mime.lookup(src), data);
}




router.get('/img/:img', ensureAuthenticated, function (req, res, next) {

    var t = fs.readFileSync('/Volumes/MDS_COMMUNICATIONS/bf2016arconvertedimages/'+req.params.img);
    res.send(t);
});