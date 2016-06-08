'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    row: {
        type: String
    },
    column: {
        type: String
    },
    data: {
        type: String
    }
},
{
    timestamps: true
});

mongoose.model('Cell', schema);
