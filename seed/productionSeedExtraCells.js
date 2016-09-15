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
    "url"];

var categories = [
    {
        name: "homepage",
        size: 100
    }
];
var seedCategories = function() {
    return findCount()
        .then(function(count) {
            return Promise.each(categories, function(category) {
                console.log("seedCategory count: ", count);
                return seedRowData(category.name, category.size, count);
            })
        })
        .then(function(data) {
            console.log('did this work? ', data);
        }).catch(console.error)
}

var findCount = function() {
    return Row.count({fob: 'homepage'})
        .then(function(count) {
            console.log('heres the count : ', count);
            return count;
        });
}
var seedRowData = function(name, size, count) {
    var outerArray = [];
    var innerArray = [];
    var obj;
    var counter = count;

    for (var i = 0; i < size; i++) {
        innerArray = [];
        counter++;
        for (var j = 0; j < columnsTemplate.length; j++) {
            // console.log('what is row', fakeRowData[i]);
            obj = {};
            if (columnsTemplate[j] === "id") {
                obj['data'] = counter;
            } else if (columnsTemplate[j] === "category") {
                obj['data'] = name;
            } else if (columnsTemplate[j] === "sortnumber") {
                obj['data'] = counter;
            } else {
                obj['data'] = "";
            }

            obj['columnName'] = columnsTemplate[j];
            obj['rowIndex'] = counter;
            obj['fob'] = name;
            innerArray.push(obj);
        }
        outerArray.push(innerArray);
        console.log('outerArray length', outerArray.length);
    }

    return Promise.map(outerArray, function(row) {
        console.log('heres each row: ', row);
        return Cell.create(row)
            .then(function (createdrow) {
                // console.log('created row: ', createdrow[0].rowIndex)
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
