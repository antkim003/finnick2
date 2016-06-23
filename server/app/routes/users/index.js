'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var User = require('mongoose').model('User');
var Promise = require('bluebird');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', function(req, res, next) {
    
});

router.post('/', function(req, res, next) {

});

router.put('/', function(req, res, next) {

});

router.delete('/:userid', function(req, res, next) {

});
