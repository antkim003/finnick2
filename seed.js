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
            console.log('created row: ', createdrow[0].fob)
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
            email: 'testing@fsa.com',
            password: 'password',
            collections: ["women","for_the_home"],
            locked: false,
            lead: true
        },
        {
            name: "admin",
            email: 'admin@gmail.com',
            password: 'test',
            locked: false,
            lead: true,
            type: "admin"
        },
        {
            "name":"photography",
            password: 'test',
            "email":"photography@gmail.com",
            "type":"photography",
            collections: ["women", "for_the_home"],
            "locked":false
        },
        {
            "name":"sitemerch",
            password: 'test',
            "email":"sitemerch@gmail.com",
            "type":"site_merch",
            "collections":["women"],
            "locked":false
        },
        {
            "name":"nocollections_sitemerch",
            password: 'test',
            "email":"nocollections_sitemerch@gmail.com",
            "type":"site_merch",
            "locked":false
        },
        {
            "name":"buyer",
            password: 'test',
            "email":"buyer@gmail.com",
            "type":"buyer",
            "lead": true,
            "locked":false,
            collections: ["women", "for_the_home"]
        },
        {
            "name":"Marketing",
            password: 'test',
            "email":"marketing@gmail.com",
            collections: ["women"],
            "type":"marketing", "lead": true,"locked":false
        },
        {
            "name":"copy",
            password: 'test',
            "email":"copy@gmail.com",
            "type":"copy",
            "lead": true,
            "collections":["men"],
            "locked":false
        },
        {
            "name":"copylocked",
            password: 'test',
            "email":"copylocked@gmail.com",
            "type":"copy",
            "lead": true,
            "collections":["men"],
            "locked":true
        },
        {"name":"Lillian Willis",
            password: 'test',
            "email":"lwillis5@latimes.com","type":"copy","locked":true},
        {"name":"Evelyn Flores",
            password: 'test',
            "email":"eflores6@baidu.com","type":"photography","locked":true},
        {"name":"Kathryn Allen",
            password: 'test',
            "email":"kallen7@howstuffworks.com","type":"copy", "lead": true,"locked":false},
        {"name":"Thomas Mitchell",
            password: 'test',
            "email":"tmitchell8@bigcartel.com","type":"buyer", "lead": true,"locked":true},
        {"name":"Bobby Nelson",
            password: 'test',
            "email":"bnelson9@usatoday.com","type":"copy", "lead": true,"collections":["women"],"locked":false},
        {"name":"Frances Gray",
            password: 'test',
            "email":"fgraya@tumblr.com","type":"photography","collections":["men"],"locked":true},
        {"name":"Teresa Ray",
            password: 'test',
            "email":"trayb@eventbrite.com","type":"site_merch", "lead": true,"collections":["women"],"locked":true},
        {"name":"Frances Diaz",
            password: 'test',
            "email":"fdiazc@ft.com","type":"copy", "lead": true,"locked":false},
        {"name":"Ruth Ramos",
            password: 'test',
            "email":"rramosd@ning.com","type":"site_merch","locked":false},
        {"name":"Kevin Green",
            password: 'test',
            "email":"kgreene@nature.com","type":"buyer", "lead": true,"locked":true},
        {"name":"Linda Mitchell",
            password: 'test',
            "email":"lmitchellf@github.com","type":"copy","collections":["women"],"locked":true},
        {"name":"Peter Peterson",
            password: 'test',
            "email":"ppetersong@xing.com","type":"copy", "lead": true,"locked":true},
        {"name":"Harold Price",
            password: 'test',
            "email":"hpriceh@guardian.co.uk","type":"buyer","collections":["women"],"locked":true},
        {"name":"Sarah Alvarez",
            password: 'test',
            "email":"salvarezi@about.com","type":"buyer", "lead": true,"locked":false},
        {"name":"Kelly Mitchell",
            password: 'test',
            "email":"kmitchellj@drupal.org","type":"copy","collections":["women"],"locked":true}
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
