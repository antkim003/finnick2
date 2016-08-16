'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Row = require('mongoose').model('Row');
var Cell = require('mongoose').model('Cell');
var ColumnIndex = require('mongoose').model('ColumnIndex');
var Promise = require('bluebird');
const http = require('http');
const blankRow = require('./blankRowTemplate.js');

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


router.get('/combobulator', function (req, res, next) {
    var arr = [];
    var _rows;
    Row.find().populate('entries').then(function(rows) {
        var t = [];
        _rows = rows;
        _.each(_.uniq(_.map(rows, 'fob')), function(e,i) {
            var obj = {};
            obj[e] = [];
            t.push(obj);
        });
        arr = t;
        return t;
    }).then(function(obj) {
        _.each(obj, function(main,i){
            _.each(_rows, function(row,i) {
                if (row.fob == Object.keys(main)[0]) {
                    main[row.fob].push(row)
                }
            })
        })
        res.json(arr);
    })
});

router.get('/:category', function(req,res,next) {
    Row.find({fob: req.params.category}).populate('entries').then(function (rows) {
        res.json(rows);
    });
});

router.get('/:category/repurposed', function(req,res,next) {
    var _columnIndices;
    ColumnIndex.find().then(function(columnIndices) {
        _columnIndices = columnIndices;
        return Row.find({fob: req.params.category}).populate('entries');
    }).then(function(rows) {
        // flattening it to be just entries
        var allrows = _.map(rows, 'entries'),
            arr = [], allobj;
        _.each(allrows, function (row, i) {
            // this creates the empty objects
            allobj = Object.assign({}, blankRow);
            _.each(row, function (cell, j) {
                if (cell.columnName != 'sortnumber' && cell.columnName != 'id') {
                    allobj[cell.columnName] = cell.data || '';
                } else {
                    allobj[cell.columnName] = parseInt(cell.data);
                }
                allobj.rowIndex = parseInt(cell.rowIndex);
            });
            arr.push(allobj);
        });
        res.json(arr);
    });
})

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
                    obj['rowIndex'] = row.index;
                    _newrow = row;
                    _oldrow = _.cloneDeep(row);
                    return Cell.create(obj);
            }).then(function(cell) {
                _cell = cell;
                _newrow.entries.push(cell);
                return _newrow.save();
            }).then(function() {
                var entriesarray = [];
//                var _row = _.cloneDeep(_oldrow);
                _oldrow.entries.forEach(function(entry){
                   var newentry = {};
                    newentry['rowIndex'] = numrows[0].length+1;
                    newentry['fob'] =  body[0].toFOB;
                    newentry['columnName'] = entry['columnName'];
                    if (newentry['columnName'] == 'id') {
                        newentry['data'] = numrows[0].length+1;
                    } else if (newentry['columnName'] == 'category' ) {
                        newentry['data'] = body[0].toFOB;
                    } else {
                        newentry['data'] = entry['data'];
                    }

                    entriesarray.push(Cell.create(newentry));
                });

                return Promise.all(entriesarray).then(function(cells){
//                    Row.create({entries:cells, fob: body[0].fromFOB, index: body[0].row});
                    return Row.create({entries:cells, fob: body[0].toFOB, index: numrows[0].length+1});
                });

            }).then(function(everything) {
                resp.json(everything);
            });
     } else {
        Row.find({fob: body[0].toFOB}).populate('entries')
            .then(function(tofobrows) {
                _toFOB = tofobrows;
                numrows.push(tofobrows);
                return Row.findByIdAndUpdate(body[0].row)
            }).then(function(row) {
                    _oldrow = _.cloneDeep(row);
                    _newrow = row;
                    var cellup = Cell.findByIdAndUpdate(body[0].killCell, {$set: {'data':true}});
                    row.save();
                    return cellup;

            }).then(function(cell) {
            }).then(function() {
                    var entriesarray = [];
                    _oldrow.entries.forEach(function(entry){
                        var newentry = {};
                        newentry['rowIndex'] = numrows[0].length+1;
                        newentry['fob'] =  body[0].toFOB;
                        newentry['columnName'] = entry['columnName'];
                        if (newentry['columnName'] == 'id') {
                            newentry['data'] = numrows[0].length+1;
                        } else if (newentry['columnName'] == 'category' ) {
                            newentry['data'] = body[0].toFOB;
                        } else {
                            newentry['data'] = entry['data'];
                        }
                        entriesarray.push(Cell.create(newentry));
                    });

                    return Promise.all(entriesarray).then(function(cells){
                        return Row.create({entries:cells, fob: body[0].toFOB, index: numrows[0].length+1});
                    });


            }).then(function(everything) {
                resp.json(everything);
            });
     }






});
