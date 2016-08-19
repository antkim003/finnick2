var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('../server/db');
var User = mongoose.model('User');
var Cell = mongoose.model('Cell');
var Row = mongoose.model('Row');
var ColumnIndex = mongoose.model('ColumnIndex');

var wipeCollections = function () {
    var removeUsers = User.remove({});
    return Promise.all([
        Cell.remove({}), Row.remove({})
    ]);
};
var columnsTemplate = require('./columnsHeaderTemplate.js')
var categories = [
    {name: "women",
    size: 200},
    {name: "men",
    size: 200},
    {name: "kids",
    size: 50},
    {name: "shoes",
    size: 50},
    {name: "jewlery&watches",
    size: 100},
    {name: "handbags&accessories",
    size: 100},
    {name: "juniors",
    size: 50},
    {name: "beauty",
    size: 200},
    {name: "for_the_home",
    size: 100},
    {name: "kitchen&dining",
    size: 100},
    {name: "bed&bath",
    size: 100},
    {name: "luggage&accessories",
    size: 50},
    {name: "furniture&mattresses",
    size: 100},
    {name:"IntlWomen",
    size: 40},
    {name: "intlmen", size: 40},
    {name: "intlkids", size: 40},
    {name: "intlshoes", size: 40},
    {name: "intljewelry&Watches", size: 40},
    {name: "intlhandbags&Accessories", size: 40},
    {name: "intljuniors", size: 40},
    {name: "intlforthehome", size: 40},
    {name: "intlkitchen&dining", size: 40},
    {name: "intlbed&bath", size: 40},
    {name: "intlluggage&accessories", size: 40},
    {name: "homepage", size: 40}
]
var seedCategories = function() {
    return Promise.each(categories, function(category) {
        console.log("seedCategory: ", category.name);
        return seedRowData(category.name, category.size);
    }).then(function(data) {
        console.log('did this work? ', data);
    }).catch(console.error)
}
var seedRowData = function(name, size) {
    var outerArray = [];
    var innerArray = [];
    var obj;
    var counter = 0;

    for (var i = 0; i < size; i++) {
        innerArray = [];
        counter++;
        for (var j = 0; j < columnsTemplate.length; j++) {
            // console.log('what is row', fakeRowData[i]);
            obj = {};
            if (columnsTemplate[j] === "id") {
                obj['data'] = i+1;
            } else if (columnsTemplate[j] === "category") {
                obj['data'] = name;
            } else if (columnsTemplate[j] === "sortnumber") {
                obj['data'] = i+1;
            } else {
                obj['data'] = null;
            }

            obj['columnName'] = columnsTemplate[j];
            obj['rowIndex'] = i;
            obj['fob'] = name;
            innerArray.push(obj);
        }
        outerArray.push(innerArray);
        console.log('outerArray length', outerArray.length);
    }

    return Promise.map(outerArray, function(row) {
        return Cell.create(row)
            .then(function(createdrow) {
                console.log('created row: ', createdrow[0].fob)
                return Row.create({
                    entries: createdrow,
                    index: createdrow[0].rowIndex,
                    fob: createdrow[0].fob
            });
        });
    }).catch(function(err) {
        console.error('err', err);
    });
};
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
        return Promise.all([seedCategories(), seedUsers()]);
    })
    .then(function (data) {
        console.log(chalk.green('Seed successful!', data.length));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
