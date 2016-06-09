'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var ColumnIndex = require('mongoose').model('ColumnIndex');
var Promise = require('bluebird');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};


router.get('/index', function (req, res, next) {
    ColumnIndex.find().then(function(columns) {
        res.json(columns);
    });
});
