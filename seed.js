var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = mongoose.model('User');
var Cell = mongoose.model('Cell');
var Row = mongoose.model('Row');
var ColumnIndex = mongoose.model('ColumnIndex');
var fakeColumnIndexData = require('./browser/data/dummycolumnindex.js');
var fakeRowData = require('./browser/data/dummyrowdata');

var wipeCollections = function () {
    var removeUsers = User.remove({});
    return Promise.all([
        removeUsers, Cell.remove({}), Row.remove({}), ColumnIndex.remove({})
    ]);
};

var seedRowData = function() {
    console.log('heres the fake row data', fakeRowData.length);
    var outerArray = [];
    var innerArray = [];
    var obj;
    var counter = 0;

    for (var i = 0; i < fakeRowData.length; i++) {
        innerArray = [];
        counter++;
        for (var entry in fakeRowData[i]) {
            // console.log('what is row', fakeRowData[i]);
            obj = {};
            obj['data'] = fakeRowData[i][entry];
            obj['columnName'] = entry;
            obj['rowIndex'] = fakeRowData[i]['id'];
            obj['fob'] = fakeRowData[i]['category'];
            innerArray.push(obj);
        }
        console.log('innerarray length', innerArray.length);
        outerArray.push(innerArray);
        console.log('outerArray length', outerArray.length);
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    return Promise.map(outerArray, function(row) {
        return Cell.create(row).then(function(createdrow) {
            console.log('created row: ', createdrow[0])
            return Row.create({
                entries: createdrow,
                index: createdrow[0].rowIndex,
                fob: createdrow[0].fob
            });
        });
    }).then(function(everything) {
        console.log('here it is ', everything.length);
    }).catch(function(err) {
        console.error('err', err);
    });
};

var seedColumnIndex = function() {
    return ColumnIndex.create(fakeColumnIndexData);
}

var seedUsers = function () {

    var users = [
        {
            name: "testing",
            username: 'testing',
            password: 'password',
            collections: ["women","for_the_home"],
            locked: false,
            lead: true
        },
        {
            name: "admin",
            username: 'admin',
            password: 'test',
            locked: false,
            lead: true,
            type: "admin"
        },
        {
            "name":"photography",
            password: 'test',
            "username":"photography",
            "type":"photography",
            collections: ["women", "for_the_home"],
            "locked":false
        },
        {
            "name":"sitemerch",
            password: 'test',
            "username":"sitemerch",
            "type":"site_merch",
            "collections":["women"],
            "locked":false
        },
        {
            "name":"nocollections_sitemerch",
            password: 'test',
            "username":"nocollections_sitemerch",
            "type":"site_merch",
            "locked":false
        },
        {
            "name":"buyer",
            password: 'test',
            "username":"buyer",
            "type":"buyer",
            "lead": true,
            "locked":false,
            collections: ["women", "for_the_home"]
        },
        {
            "name":"Marketing",
            password: 'test',
            "username":"marketing",
            collections: ["women"],
            "type":"marketing", "lead": true,"locked":false
        },
        {
            "name":"copy",
            password: 'test',
            "username":"copy",
            "type":"copy",
            "lead": true,
            "collections":["men"],
            "locked":false
        },
        {
            "name":"copylocked",
            password: 'test',
            "username":"copylocked",
            "type":"copy",
            "lead": true,
            "collections":["men"],
            "locked":true
        }
    ];

    return User.create(users);

};

connectToDb
    .then(function () {
        return wipeCollections();
    })
    .then(function () {
        return Promise.all([seedRowData(),seedUsers(), seedColumnIndex()]);
    })
    .then(function (data) {
        console.log(chalk.green('Seed successful!', data.length));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
