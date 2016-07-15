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
     var _toFOB, _cell, _newrow, _oldrow;


    if (body[0].killCell == 'newcell') {
        Row.find({fob: body[0].toFOB}).populate('entries')
            .then(function(tofobrows) {
                _toFOB = tofobrows;
                numrows.push(tofobrows);
                return Row.findByIdAndUpdate(body[0].row).populate('entries')
            }).then(function(row) {
                    var _cell;
                    var obj = {};
                    obj['data'] = true;
                    obj['columnName'] = 'killedrow';
//                    console.log(row.index);
                    obj['rowIndex'] = row.index;
                    _newrow = row;
                    _oldrow = _.cloneDeep(row);
                    return Cell.create(obj);

            }).then(function(cell) {
                console.log('first then');
                _cell = cell;
                _newrow.entries.push(cell);
                return _newrow.save();
            }).then(function() {
                console.log('third then');
                var entriesarray = [];
                entriesarray =
                _oldrow.entries.map(function(entry){
                   console.log(entry, 'in map');
                   entry['rowIndex'] = numrows[0].length+1;
                   entry['fob'] =  body[0].toFOB;
                    if (entry['columnName'] == 'id') {
                        entry['data'] = numrows[0].length+1;
                    }
                    if (entry['columnName'] == 'category') {
                        entry['data'] = body[0].toFOB;
                    }
                   return Cell.create(entry);

                });

                return Promise.all(entriesarray).then(function(cells){
                    return Row.create({entries:cells, fob: body[0].toFOB, index: numrows[0].length+1});
                });

            }).then(function(everything) {
                console.log('testing test', everything);
                resp.json(everything);
            });
     } else {
        Row.find({fob: body[0].toFOB}).populate('entries')
            .then(function(tofobrows) {
                _toFOB = tofobrows;
                numrows.push(tofobrows);
                return Row.findByIdAndUpdate(body[0].row)
            }).then(function(row) {
                if (body[0].killCell == 'newcell') {
                    var _cell;
                    var obj = {};
                    obj['data'] = true;
                    obj['columnName'] = 'killedrow';
//                    console.log(row.index);
                    obj['rowIndex'] = row.index;
                    _newrow = row;
                    return Cell.create(obj);
                }
            }).then(function(cell) {
                console.log('first then');
                _cell = cell;
                _row.entries.push(cell);
                return _row.save();
            }).then(function() {
                console.log('third then');
                var entriesarray = [];
                return Row.create({});
            }).then(function(everything) {
                console.log('testing test');
                resp.json(everything);
            });
     }






});