const mongoose = require('mongoose');
const Promise = require('bluebird');
const chalk = require('chalk');
const connectToDb = require('../server/db');
const Permission = mongoose.model('Permission');

const permissionsArr = require('../browser/data/userpermissions.js');

const wipeCollections = function () {
    let removePermission = Permission.remove({});
    return Promise.all([
        removePermission
    ]);
};

seedPermissions = function() {
    return Permission.create(permissionsArr);
}

connectToDb
    .then(function () {
        return wipeCollections();
    })
    .then(function () {
        return Promise.all([seedPermissions()]);
    })
    .then(function (data) {
        console.log(chalk.green('Seed successful!', data.length));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
