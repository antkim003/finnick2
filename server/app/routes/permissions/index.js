'use strict';
const router = require('express').Router();
const _ = require('lodash');
const Permission = require('mongoose').model('Permission');
const Promise = require('bluebird');


router.get('/', function(req, res, next) {
  Permission.find({})
    .then(function(permissions) {
      res.json(permissions);
    })
    .catch(next);
});

module.exports = router;
