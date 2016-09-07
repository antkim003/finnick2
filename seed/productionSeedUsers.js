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
        removeUsers
    ]);
};


var seedUsers = function () {

    var users = [
        {
            "name": "photography_lead",
            "username": 'photography_lead',
            "password": 'photo123',
            "collections": ["women","for_the_home"],
            "locked": false,
            "lead": true,
            "type": "photography"
        },
        {
            "name": "copy_lead",
            "username": 'copy_lead',
            "password": 'copy123',
            "collections": ["women","for_the_home"],
            "locked": false,
            "lead": true,
            "type": "copy"
        },
        {
            "name": "sitemerch_lead",
            "username": 'sitemerch_lead',
            "password": 'sitemerch123',
            "collections": ["women","for_the_home"],
            "locked": false,
            "lead": true,
            "type": "site_merch"
        }
    ];

    return User.create(users);

};

connectToDb
    // .then(function () {
    //     // return wipeCollections();
    // })
    .then(function () {
        return Promise.all([seedUsers()]);
    })
    .then(function (data) {
        console.log(chalk.green('Seed successful!', data.length));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
