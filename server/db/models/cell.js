'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    rowIndex: {
        type: Number
    },
    columnIndex: {
        type: String
    },
    columnName: {
        type: String
    },
    data: {
        type: String
    },
    fob: {
        type: String
    }
},
{
    timestamps: true
});

mongoose.model('Cell', schema);
