var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('../server/db');
var ColumnIndex = mongoose.model('ColumnIndex');
var ColumnData = require('./columnHeaderData.js');

var wipeCollections = function () {
    return Promise.all([
        ColumnIndex.remove({})
    ]);
};

var seedColumnIndex = function() {
    return ColumnIndex.create(ColumnData)
        .then(function(column_indices) {
            console.log('column_indices: ', column_indices.length);
            return ColumnIndex.find({});
        })
        .then(function(columns) {
            console.log('where are the columns?', columns);
            return columns;
        })
        .catch(console.error)
}

connectToDb
    .then(function() {
        wipeCollections()
    })
    .then(function () {
        return Promise.all([seedColumnIndex()]);
    })
    .then(function (data) {
        console.log(chalk.green('Seed successful!', data.length));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
