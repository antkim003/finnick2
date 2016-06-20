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
    console.log("this came here /categories");
    Cell.find({"columnName": "category" }).then(function(categoryCells) {
        console.log('it found all the category cells', categoryCells);
        let categories = categoryCells.map(function(cell) {
            return cell.data;
        });
        let uniqueCategories = _.uniq(categories);
        console.log('heres the unique categories', uniqueCategories);
        res.json({categories: uniqueCategories});
    });
});
