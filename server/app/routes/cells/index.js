'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Cell = require('mongoose').model('Cell');
var Promise = require('bluebird');
var Row = require('mongoose').model('Row');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};


router.get('/:id', function (req, res, next) {
    Cell.findById(req.params.id).then(function(cell) {
        res.json(cell);
    });
    next()
});
router.get('/:fob/:row', function (req, res, next) {
    Cell.find({ fob: req.params.fob , rowIndex: req.params.row-1 }).lean().then(function(cell) {
        var newobj = {};
        _.each(cell, function(entry, i) {
            if (!newobj[entry.columnName]) {
                newobj[entry.columnName] = entry.data;
            }
        })
        return newobj;
    }).then(function(newobj){
        res.json(newobj);
    });
});

router.put('/', function(req,res,next) {
    // always come in as an array of cells
    var cells = req.body;
    return Promise.map(cells, function(cell) {
        return Cell.findByIdAndUpdate(cell._id, {$set: cell}, {new: true}).then(function(cell) {
            return cell;
        })
    }).then(function(everything) {
        res.json(everything);
    })
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
       obj['rowIndex'] = parseInt(cell.row.split('-')[0])+1;

       return Cell.create(obj)
        .then(function(cell) {
            _cell = cell;
            return Row.findOne({index: parseInt(obj.rowIndex), fob: fob})
        })
        .then(function(row) {
            row.entries.push(_cell);
            return row.save();
        })
   }).then(function(everything) {
       res.json(everything);
   })
});
