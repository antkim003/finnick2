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
var socketio = require('socket.io');
var io = null;
var fs = require('fs');
var col = require('./columnnamesmap.js')
//var jsonXlsx = require('icg-json-to-xlsx');
//var filename = "./output.xlsx";

var json2xls = require('json2xls');





var socket = require('../../../io');
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
//    console.log(socket.testserver);

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
        socket.testserver.on('connection', function (socket1) {
            console.log('connected')
            socket1.emit('test', {});
        });
        var end = new Date() - start;
        console.info("Execution time: %dms", end);
//        res.json(arr);
        fs.writeFileSync('./dist/all-finnick-data.json', 'jsonp('+JSON.stringify(arr)+')');
        res.download('./dist/all-finnick-data.json');
    })
});


router.get('/combobulator/:category', function (req, res, next) {
    if (req.params.category != 'exportall') {
        var start = new Date();
        var arr = [];
        var _rows;
        Row.find({fob: req.params.category}).lean().populate('entries').then(function(rows) {
            _rows = rows;
            var obj = {};
            obj[req.params.category] = [];
            var categoriesarr = obj;
            arr = [categoriesarr];
            var keys = new Date() - start;
            console.info("Execution keys time: %dms", keys);
            return categoriesarr;
        }).then(function(obj) {
            _.each(_rows, function(row,idx2) {
                if (row.fob == req.params.category) {
                    _.each(row.entries, function(e, i){
                        var newobj = {};
                        if (req.params.category != 'women' && req.params.category != 'IntlWomen'){
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
                                newobj[e.columnName] = e.data;
                                row.entries[i] = newobj;
                            }
                        }
                        delete row.updatedAt;
                        delete row.createdAt;
                        delete row.__v;
                        delete row.locked;

                        if (e.columnName == 'killedrow') {
                            if (e.data == 'true') {
                                row.killed = 'KILLED';
                            }
                        }

                        if (i == row.entries.length-1) {
                            row.entries = _.compact(row.entries);
//                            console.log(row);
                            if (row.killed != 'KILLED') {
                                arr[0][req.params.category].push(row)
                            }

//                            _.each(_.map(row.entries, 'doubleexposure'), function(val,i) {
//                                if (val) {
//                                    var result = arr.filter(function( obj ) {
//                                        return obj[val];
//                                    });
//                                    _.map(result, val)[0].push(row);
//                                }
//                            })
//
//                            _.each(_.map(row.entries, 'doubleexposure2'), function(val,i) {
//                                if (val) {
//                                    var result = arr.filter(function( obj ) {
//                                        return obj[val];
//                                    });
//                                    _.map(result, val)[0].push(row);
////                                    console.log(_.map(result, val)[0].length)
//                                }
//                            })
//
//                            _.each(_.map(row.entries, 'doubleexposure3'), function(val,i) {
//                                if (val) {
//                                    var result = arr.filter(function( obj ) {
//                                        return obj[val];
//                                    });
//                                    _.map(result, val)[0].push(row);
////                                    console.log(_.map(result, val)[0].length)
//                                }
//                            })

                        }

                    })
                }
            })
            return obj;

        }).then(function(obj) {
            var end = new Date() - start;
            console.info("Execution time: %dms", end);
            res.json(arr);
        })
    } else {
        next();
    }

});

router.get('/preview/:category', function (req, res, next) {
    if (req.params.category != 'exportall') {
        var start = new Date();
        var arr = [];
        var _rows;
        Row.find({fob: req.params.category}).lean().populate('entries').then(function(rows) {
            _rows = rows;
            var obj = {};
            obj[req.params.category] = [];
            var categoriesarr = obj;
            arr = [categoriesarr];
            var keys = new Date() - start;
            console.info("Execution keys time: %dms", keys);
            return categoriesarr;
        }).then(function(obj) {
            _.each(_rows, function(row,idx2) {
                if (row.fob == req.params.category) {
                    _.each(row.entries, function(e, i){
                        var newobj = {};
                        newobj[e.columnName] = e.data;
                        row.entries[i] = newobj;

                        delete row.updatedAt;
                        delete row.createdAt;
                        delete row.__v;
                        delete row.locked;

                        if (e.columnName == 'killedrow') {
                            if (e.data == 'true') {
                                row.killed = 'KILLED';
                            }
                        }

                        if (i == row.entries.length-1) {
                            row.entries = _.compact(row.entries);
                            if (row.killed != 'KILLED') {
                                arr[0][req.params.category].push(row)
                            }
                        }

                    })
                }
            })
            return obj;

        }).then(function(obj) {
            var end = new Date() - start;
            console.info("Execution time: %dms", end);
            res.json(arr);
        })
    } else {
        next();
    }

});


router.get('/combobulator/:category/export', function(req, res, next) {
    var start = new Date();
    var arr = [];
    var _rows;
    Row.find({fob: req.params.category}).lean().populate('entries').then(function(rows) {
        _rows = rows;
        var obj = {};
        obj[req.params.category] = [];
        var categoriesarr = obj;
        arr = [categoriesarr];
        var keys = new Date() - start;
        console.info("Execution keys time: %dms", keys);
        return categoriesarr;
    }).then(function(obj) {
        _.each(_rows, function(row,idx2) {
            if (row.fob == req.params.category) {
                row.all = {};
                _.each(row.entries, function(e, i){
                    var newobj = {};
                    if (e.columnName != 'id' && e.columnName != 'sortnumber' && e.columnName != 'mcomprojectedsales') {
                        newobj[col[e.columnName]] = e.data;
                    } else {
                        newobj[col[e.columnName]] = parseFloat(e.data);
                    }
//                    row.entries[i] = newobj;
                    row.all = _.extend(row.all, newobj);
                    delete row.updatedAt;
                    delete row.createdAt;
                    delete row.__v;
                    delete row.locked;
                    if (e.columnName == 'killedrow') {
                        if (e.data == 'true') {
                            row.killed = 'KILLED';
                        }
                    }

                    if (i == row.entries.length-1) {
//                        row.entries = _.compact(row.entries);
                        if (row.killed != 'KILLED') {
                            arr[0][req.params.category].push(row.all)
                        }

                    }

                })
            }
        })
        return obj;

    }).then(function(obj) {
        var end = new Date() - start;
        console.info("Execution time: %dms", end);
        var jsonfeed = arr[0][req.params.category];
        var xls = json2xls(jsonfeed);
        fs.writeFileSync('./dist/'+req.params.category+'-finnick-data.xlsx', xls, 'binary');
        res.download('./dist/'+req.params.category+'-finnick-data.xlsx');
//        fs.writeFileSync('data.xlsx', xls, 'binary');
//        res.json(jsonfeed);

    })
})





router.get('/combobulator/exportall', function (req, res, next) {
    console.log('all')
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
        ];
//        arr = categoriesarr;
        var keys = new Date() - start;
        console.info("Execution keys time: %dms", keys);
        return categoriesarr;
    }).then(function(obj) {
        _.each(obj, function(main,idx){
            _.each(_rows, function(row,idx2) {
                if (row.fob == Object.keys(main)[0]) {
                    var newentries = [];
                    _.each(row.entries, function(e, i){
                        var newobj = {};
                        if (e.columnName != 'id' && e.columnName != 'sortnumber' && e.columnName != 'mcomprojectedsales') {
                            newobj[col[e.columnName]] = e.data;
                        } else {
                            newobj[col[e.columnName]] = parseFloat(e.data);
                        }
//                    row.entries[i] = newobj;
                        row.all = _.extend(row.all, newobj);
                        delete row.updatedAt;
                        delete row.createdAt;
                        delete row.__v;
                        delete row.locked;
                        if (e.columnName == 'killedrow') {
                            if (e.data == 'true') {
                                row.killed = 'KILLED';
                            }
                        }

                        if (i == row.entries.length-1) {
                            row.entries = _.compact(row.entries);
                            if (row.killed != 'KILLED') {
                                arr.push(row.all);
                            }
                        }


                    })
                }
            })
        })
    }).then(function() {
        var end = new Date() - start;
        console.info("Execution time: %dms", end);
        var jsonfeed = arr;
//        console.log(arr);
        var xls = json2xls(jsonfeed);
        fs.writeFileSync('./dist/all-finnick-data.xlsx', xls, 'binary');
        res.download('./dist/all-finnick-data.xlsx');
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


