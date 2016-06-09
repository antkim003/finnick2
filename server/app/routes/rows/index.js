'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Row = require('mongoose').model('Row');
var Cell = require('mongoose').model('Cell');
var Promise = require('bluebird');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};



router.get('/', function (req, res, next) {
    Row.find().populate('entries').then(function(rows) {
        res.json(rows);
    });
});

router.get('/:category', function(req,res,next) {
    return Cell.find({columnName: req.params.category})
    .then(function(cells) {
      return Promise.map(cells, function(cell) {
        return Row.find({index: cell.rowIndex}).populate('entries')
      })
    }).then(function(rows) {
      res.json(_.flatten(rows));
    });
});

router.post('/boost', function(req,res,next) {

});