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
//    Row.find({fob: req.params.category}).populate('entries').then(function(rows) {
//        res.json(rows);
//    });
    Row.find().populate('entries').then(function(rows) {
         var filteredrows = _.filter(rows, function(e){ return e.entries[_.findIndex(e.entries, function(eb){ return eb.columnName == 'category' } )].data == req.params.category })
         res.json(filteredrows);
    });
});

router.post('/boost', function(req,res,next) {

});

router.post('/', function(req,res,next) {
   // always come in as an array of cells
   var cells = req.body;
   var fob = req.body[0].fob;
   var index = req.body[0].row.split('-')[0];

   var _cell;
   return Promise.map(cells, function(cell) {
       var obj = {};
       obj['data'] = cell.data;
       obj['columnName'] = cell.row.split('-')[1];
       obj['rowIndex'] = cell.row.split('-')[0];

       return Cell.create(obj)
        .then(function(cell) {
            _cell = cell;
            return Row.findOne({index: parseInt(cell.index)})
        })
        .then(function(row) {
            row.entries.push(_cell);
            return row.save();
        })
   }).then(function(everything) {
       res.json(everything);
   })
});
