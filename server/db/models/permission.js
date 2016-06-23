'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    columns: {
        type: Array
    }
},
{
    timestamps: true
});

mongoose.model('Permission', schema);
