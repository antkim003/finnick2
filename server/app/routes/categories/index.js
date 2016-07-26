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

// get all unique categories
router.get('/', function(req,res,next) {
    Cell.find({"columnName": "category" }).then(function(categoryCells) {
        let categories = categoryCells.map(function(cell) {
            return cell.data;
        });
        let uniqueCategories = _.uniq(categories);
        res.json({categories: uniqueCategories});
    },next);
});
