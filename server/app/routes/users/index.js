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

router.get('/:userId', function(req, res, next) {
    let userId = req.params.userId;
    User.findById(userId)
        .then(function(user) {
            res.json(user);
        }, next);
});

router.post('/', function(req, res, next) {
    User.create(req.body)
        .then(function(user) {
            res.json(user);
        }, next);
});

router.put('/:userId', function(req, res, next) {
    let userId = req.params.userId;
    console.log('here is reqbody ', req.body, 'id: ', userId);
    var _user;
    User.findById(userId).then(function(user) {
        let keys = Object.keys(req.body);
        keys.forEach(function(key) {
            user[key] = req.body[key];
        });
        _user = user;
        return user.save();
    })
    .then(function(response) {
        console.log('did this work?', _user);
        res.json(_user)
    },next);
});

router.delete('/:userid', function(req, res, next) {
    User.findById(req.params.userid)
        .then(function(user) {
            user.remove();
            console.log('removed', user);
            res.json('destroyed');
        }, next);
});
