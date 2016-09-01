'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Row = require('mongoose').model('Row');
var Cell = require('mongoose').model('Cell');
var ColumnIndex = require('mongoose').model('ColumnIndex');
var Promise = require('bluebird');
const http = require('http');
//const blankRow = require('./blankRowTemplate.js');

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

//TODO: need to reduce size; currently 21 mb
router.get('/combobulator', function (req, res, next) {
    var start = new Date();
    var arr = [];
    var _rows;
    Row.find().lean().populate('entries').then(function(rows) {
        _rows = rows;
        var categoriesarr = [
            {"women": []},
            {"men": []},
            {"kids": []},
            {"shoes": []},
            {"jewlery&watches": []},
            {"handbags&accessories": []},
            {"juniors": []},
            {"beauty": []},
            {"for_the_home": []},
            {"kitchen&dining": []},
            {"bed&bath": []},
            {"luggage&accessories": []},
            {"furniture&mattresses": []},
            {"IntlWomen": []},
            {"intlmen": []},
            {"intlkids": []},
            {"intlshoes": []},
            {"intljewelry&Watches": []},
            {"intlhandbags&Accessories": []},
            {"intljuniors": []},
            {"intlforthehome": []},
            {"intlkitchen&dining": []},
            {"intlbed&bath": []},
            {"intlluggage&accessories": []}
        ]
        arr = categoriesarr;
        var keys = new Date() - start;
        console.info("Execution keys time: %dms", keys);
        return categoriesarr;
    }).then(function(obj) {
        res.writeContinue();
        _.each(obj, function(main,idx){
            _.each(_rows, function(row,idx2) {
                if (row.fob == Object.keys(main)[0]) {
                    var newentries = [];
                    _.each(row.entries, function(e, i){
                        var newobj = {};
                        //which columns needed for display?
                        //name
                        //copy
                        //price
                        //image
//                        newobj[e.columnName] = e.data;
                        if (Object.keys(main)[0] != 'women' && Object.keys(main)[0] != 'IntlWomen'){
                            if (e.columnName == 'bffavorites' ||
                                e.columnName == 'extra' ||
                                e.columnName == 'extraomniprojectedsales' ||
                                e.columnName == 'featureproductid' ||
                                e.columnName == 'instorespecial' ||
                                e.columnName == 'livedate' ||
                                e.columnName == 'markettointernational' ||
                                e.columnName == 'needsavedset' ||
                                e.columnName == 'notesfrombuyersimg' ||
                                e.columnName == 'notesfromretouchimg' ||
                                e.columnName == 'notesoncategory' ||
                                e.columnName == 'plenti' ||
                                e.columnName == 'projectedunits' ||
                                e.columnName == 'salesfor2015' ||
                                e.columnName == 'singleormultiple' ||
                                e.columnName == 'savedsetid' ||
                                e.columnName == 'pricingcomments' ||
                                e.columnName == 'alsoinpetites' ||
                                e.columnName == 'petitescategoryid' ||
                                e.columnName == 'petiteslinktype' ||
                                e.columnName == 'petitesproductid' ||
                                e.columnName == 'petitessavedset' ||
                                e.columnName == 'petitesurl'
                                ) {
                                delete row.entries[i];
                            } else {
                                newobj[e.columnName] = e.data;
                                row.entries[i] = newobj;
                            }
                        } else {
                            if (e.columnName == 'bffavorites' ||
                                e.columnName == 'extra' ||
                                e.columnName == 'extraomniprojectedsales' ||
                                e.columnName == 'featureproductid' ||
                                e.columnName == 'livedate' ||
                                e.columnName == 'markettointernational' ||
                                e.columnName == 'needsavedset' ||
                                e.columnName == 'notesfrombuyersimg' ||
                                e.columnName == 'notesfromretouchimg' ||
                                e.columnName == 'notesoncategory' ||
                                e.columnName == 'plenti' ||
                                e.columnName == 'projectedunits' ||
                                e.columnName == 'salesfor2015' ||
                                e.columnName == 'singleormultiple' ||
                                e.columnName == 'savedsetid' ||
                                e.columnName == 'pricingcomments'

                                ) {
                                delete row.entries[i];
                            } else {
//                                if (e.columnName == 'doubleexposure') {
//                                    row.doubleexposure = e.data;
//                                }
//                                if (e.columnName == 'doubleexposure2') {
//                                    row.doubleexposure2 = e.data;
//                                }
                                newobj[e.columnName] = e.data;
                                row.entries[i] = newobj;
                            }
                        }

                        row.updatedAt = undefined;
                        row.createdAt = undefined;
                        row.__v = undefined;
                        row.locked = undefined;

                        if (e.columnName == 'killedrow') {
                            if (e.data == 'true') {
                                 row.killed = 'KILLED';
                            }
                        }

                        if (i == row.entries.length-1){
                            row.entries = _.compact(row.entries);


                            //pushing row to fob array
                            if (row.killed != 'KILLED') {
                                main[row.fob].push(row);
                            }


                            //delete if killed?
//                            _.find(_.map(row.entries, 'killedrow'), function(val) {
//                                if (val == 'true') {
//                                    console.log(val);
//                                } else {
//                                    main[row.fob].push(row);
//                                }
//                            });


                            _.each(_.map(row.entries, 'doubleexposure'), function(val,i) {
                                if (val) {
                                    var result = arr.filter(function( obj ) {
                                        return obj[val];
                                    });
                                    _.map(result, val)[0].push(row);
//                                    console.log(_.map(result, val)[0].length)
                                }
                            })

                            _.each(_.map(row.entries, 'doubleexposure2'), function(val,i) {
                                if (val) {
                                    var result = arr.filter(function( obj ) {
                                        return obj[val];
                                    });
                                    _.map(result, val)[0].push(row);
//                                    console.log(_.map(result, val)[0].length)
                                }
                            })

                            _.each(_.map(row.entries, 'doubleexposure3'), function(val,i) {
                                if (val) {
                                    var result = arr.filter(function( obj ) {
                                        return obj[val];
                                    });
                                    _.map(result, val)[0].push(row);
//                                    console.log(_.map(result, val)[0].length)
                                }
                            })

                        }
                    })
                }
            })
        })
    }).then(function() {

        var end = new Date() - start;
        console.info("Execution time: %dms", end);
        res.json(arr);
    })
});

router.get('/:category', function(req,res,next) {
    if (req.params.category != 'combobulator') {
        Row.find({fob: req.params.category}).lean().populate('entries').then(function (rows) {
            res.json(rows);
        });
    } else {
        next();
    }
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
