'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Row = require('mongoose').model('Row');
var Cell = require('mongoose').model('Cell');
var Promise = require('bluebird');
const http = require('http');

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
   Row.find({fob: req.params.category}).populate('entries').then(function(rows) {
       res.json(rows);
   });
});

router.post('/boost', function(req,res,next) {

});

router.post('/checkurl', function(req,response,next){
    var body = req.body;
    _.each(body, function(row, i) {
        //url
        if(_.isNaN(parseInt(row))) { // explicit url
            var reqs = http.get(row, (res2) => {
                    var t = [];
                    res2.on("data", function(chunk) {
                        t.push(chunk)//                        console.log("BODY: " + chunk);
                    }).on('end', function(end) {
                        t = Buffer.concat(t).toString();
                        if (t.indexOf('navailable') > -1 || t.indexOf('Product - Not Available - Macy\'s') > -1) {
                            response.write(i+1+': '+row+',  <br/>', function(err) {
//                              setTimeout(function(){ res.end(); }, 5000)
                            });
                        }
                    });
                    res2.resume();
                }).on('error', (e) => {
                    console.log('Got error');
                });
        } else {
            var reqs = http.get('http://www1.macys.com/shop/product/?ID='+row, (res2) => {
                    var t = [];
                    res2.on("data", function(chunk) {
                        t.push(chunk)//                        console.log("BODY: " + chunk);
                    }).on('end', function(end) {
                        t = Buffer.concat(t).toString();
                        if (t.indexOf('navailable') > -1 || t.indexOf('Product - Not Available - Macy\'s') > -1) {
                            response.write(i+1+': '+row+', <br/> ', function(err) {
//                                setTimeout(function(){ res.end(); }, 5000)
                            });
                        }
                    });
                    res2.resume();
                }).on('error', (e) => {
                    console.log('Got error');
                });
        } // end of url v c/p

//if (i == body.length-1) {
//    response.end();
//}
        setTimeout(function(){ response.end(); }, 9000);
    }) // end of for loop


})