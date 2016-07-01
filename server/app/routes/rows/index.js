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

var promisifiedReq = function(row, i) {
    return new Promise(function (resolve, reject) {
        var t = [];
        var url = row;
        if (_.isNaN(parseInt(row))){
            url = row;
        } else {
            url = 'http://www1.macys.com/shop/product/?ID='+row;
        }
        http.get(url, function(res2) {
            res2.on("data", function(chunk) {
                t.push(chunk);
            }).on('error', function(err){
                resolve();
            }).on('end', function(){
                var bod = Buffer.concat(t).toString();
                if (bod.indexOf('navailable') > -1 || bod.indexOf('Product - Not Available - Macy\'s') > -1) {
                    resolve('{"'+[i+1]+'": "'+url+'"}')
                } else {
                    resolve('{"'+[i+1]+'": "ok"}');
                }
            })
        });
    })
}

router.post('/checkurl', function(req,response,next){
    var body = req.body;
    var all = [];
    Promise.map(body, function (data, index) {
        return promisifiedReq(data, index)
    }).then(function(data1) {
        response.write('['+data1+']');
        response.end();
    })


})