'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('../server/db');
var User = mongoose.model('User');
var Cell = mongoose.model('Cell');
var Row = mongoose.model('Row');
var ColumnIndex = mongoose.model('ColumnIndex');
var devFakeData = require('./devFakeData.js').entries;
var faker = require('faker');

var wipeCollections = function () {
    return Promise.all([
        Cell.remove({columnName: 'women'}), Row.remove({fob: 'women'})
    ]);
};
var columnsTemplate = [
    "alsoinpetites",
    "arimageid",
    "bffavorites",
    "category",
    "categoryid",
    "doubleexposure",
    "doubleexposure2",
    "doubleexposure3",
    "doubleexposuresubcategory",
    "doubleexposuresubcategory2",
    "doubleexposuresubcategory3",
    "extra",
    "extraomniprojectedsales",
    "featureproductid",
    "goingfast",
    "id",
    "imageid",
    "instorespecial",
    "killedrow",
    "linktype",
    "livedate",
    "lockedrow",
    "markettointernational",
    "mcomregprice",
    "mcomspecial",
    "mcomspecialprice",
    "name",
    "needsavedset",
    "notesfrombuyersimg",
    "notesfromretouchimg",
    "notesoncategory",
    "omniprojectedsales",
    "petitescategoryid",
    "petiteslinktype",
    "petitesproductid",
    "petitessavedset",
    "petitesurl",
    "plenti",
    "pricingcategory",
    "pricingcomments",
    "pricinginfo",
    "productid",
    "projectedsales",
    "projectedunits",
    "rowIndex",
    "salesfor2015",
    "savedsetid",
    "singleormultiple",
    "sortnumber",
    "storeregprice",
    "storeregularprice",
    "storespecialprice",
    "subcategories",
    "tilecopy1",
    "tilecopy2",
    "tilecopy3",
    "tilecopy4",
    "tileimage",
    "tilestyle",
    "url"]
var categories = [
    {name: "women",
    size: 200}
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
            switch (columnsTemplate[j]) {
                case "id":
                    obj['data'] = i+1;
                    break;
                case "category":
                    obj['data'] = name;
                    break;
                case "sortnumber":
                    obj['data'] = i+1;
                case "arimageid":
                    obj['data'] = "2847203";
                    break;
                case "tilecopy1":
                    obj['data'] = faker.commerce.productName().toString();
                    break;
                case "tilecopy2":
                    obj['data'] = "$" + faker.commerce.price().toString();
                    break;
                case "tilecopy3":
                    obj['data'] = faker.commerce.productAdjective().toString();
                    break;
                case "tilecopy4":
                    obj['data'] = faker.commerce.productAdjective().toString();;
                    break;
                case "tilestyle":
                    obj['data'] = "1";
                    break;
                default:
                    obj['data'] = null;
            }

            obj['columnName'] = columnsTemplate[j];
            obj['rowIndex'] = i;
            obj['fob'] = name;

            console.log('obj: ', obj);
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


connectToDb
    .then(function () {
        return wipeCollections();
    })
    .then(function () {
        return Promise.all([seedCategories()]);
    })
    .then(function (data) {
        console.log(chalk.green('Seed successful!', data.length));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
