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

var isLeadOrAdmin = function(req, res, next) {
    User.findById(req.session.passport.user).then(function(user) {
        req.session.user = user;
        if(req.session.user.lead || req.session.user.type === "admin") {
            next()
        } else {
            res.status(401).end();
        }
    }).catch(function() {
        res.statuse(401).end();
    });
};

router.get('/types', function(req, res, next) {
    User.find({})
        .then(function(users) {
            let types = users.map(function(user) {
                return user.type;
            });
            let uniqueTypes = _.uniq(types);
            uniqueTypes = uniqueTypes.filter( n => {
                return n != undefined
            });
            res.json({types: uniqueTypes})
        }, next);
});

router.get('/:userId', function(req, res, next) {
    let userId = req.params.userId;

    User.findById(userId)
        .then(function(user) {
            res.json(user);
        }, next);
});

router.post('/', isLeadOrAdmin, function(req, res, next) {
    User.create(req.body)
        .then(function(user) {
            res.json(user);
        }, next);
});

router.put('/:userId', isLeadOrAdmin, function(req, res, next) {
    let userId = req.params.userId;
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
        res.json(_user)
    },next);
});

router.delete('/:userid', isLeadOrAdmin, function(req, res, next) {
    User.findById(req.params.userid)
        .then(function(user) {
            user.remove();
            res.json('destroyed');
        }, next);
});
