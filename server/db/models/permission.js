'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    type: {
        type: String
    },
    permission: {
        type: Array
    }
},
{
    timestamps: true
});

mongoose.model('Permission', schema);
