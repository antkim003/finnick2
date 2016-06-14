'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Cell = require('mongoose').model('Cell');
var Promise = require('bluebird');

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
});

router.put('/', function(req,res,next) {
    // always come in as an array of cells
    var cells = req.body.data;
    return Promise.map(cells, function(cell) {
        return Cell.findByIdAndUpdate(cell._id, {$set: cell}, {new: true}).then(function(cell) {
            return cell;
        })
    }).then(function(everything) {
        res.json(everything);  
    })
});