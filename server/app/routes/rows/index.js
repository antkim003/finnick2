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
        if (row[0] == 'h'){
            url = row;
        } else {
            if (row.indexOf('c-') > -1) {
                url = 'http://www1.macys.com/shop/?id='+row.split('c-')[1];
            } else if (row.indexOf('p-') > -1) {
                url = 'http://www1.macys.com/shop/product/?ID='+row.split('p-')[1];
            } else {
                url = row;
            }
        }
        if (url[0] == 'h') {
            http.get(url, function(res2) {
                res2.on("data", function(chunk) {
                    t.push(chunk);
                }).on('error', function(err){
                    resolve();
                }).on('end', function(){
                    var bod = Buffer.concat(t).toString();
                    if(i==1){
//                        console.log(bod, 'test');
                    }
                    if (bod.indexOf('title') > -1) {
                        if (bod.indexOf('Not Available') > -1) {
                            resolve('{"'+[i+1]+'": "'+url+'"}')
                        } else {
                            resolve('{"'+[i+1]+'": "ok"}');
                        }
                    } else {
                        // no body
                        resolve('{"'+[i+1]+'": "'+url+'"}')
                    }
                })
            });
        } else {
            resolve('{"'+[i+1]+'": "'+url+'"}')
        }

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

router.post('/moverow', function(req,resp,next){
     var body = req.body;
     var numrows = [];
     var _toFOB;
     Row.find({fob: body[0].toFOB}).populate('entries').then(function(tofobrows) {
        _toFOB = tofobrows;
        numrows.push(tofobrows);
//        console.log(req.body)
        return Promise.map(body, function(row) {
            return Row.findByIdAndUpdate(row.row).then(function(row) {
                if (body[0].killCell == 'newcell') {
                    var _cell;
                    var obj = {};
                    obj['data'] = true;
                    obj['columnName'] = 'killedrow';
//                    console.log(row.index);
                    obj['rowIndex'] = row.index;
                    return Cell.create(obj)
                        .then(function(cell) {
                            _cell = cell;
                            return row;
                        })
                        .then(function(row1) {
                            row1.entries.push(_cell);
                            return row1.save(); //created killed row in original fob
                        })
                        .then(function() {
                            var _row;
                            var entriesarray = [];
                            row.entries.forEach(function(entry){

//                                return Cell.create(entry).
                            });


                            _row['entries'] = [];
                            _row['fob'] = body[0].toFOB;
                            _row['index'] = numrows[0][numrows[0].length-1].index+1;
                            return Row.create(_row);
                        })
                        .then(function(newrow) {
                            console.log(_toFOB, 'new row');
                            _toFOB.push(newrow);
                            return _toFOB.save();
                        });
                } else {
//                    row.entries.forEach(function(e){
                        return Cell.findByIdAndUpdate(body[0].killCell).then(function(cell) {
//                        return cell;
//                            if (cell._id == body[0].killCell) {
                                console.log( 'killed existed');
                                return Cell.findByIdAndUpdate(cell._id, {$set: {data: true}}).then(function(cell) {
                                    var _cell = cell;
                                    row.entries.push(_cell);
                                });
//                            }
                        })
//                    });
                }
//                return row;

            })
        }).then(function(everything) {
            resp.json(everything);
        })
     });




});