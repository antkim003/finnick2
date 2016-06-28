'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    entries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cell'
    }],
    index: {
        type: Number
    },
    fob: {
        type: String
    },
    locked: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

mongoose.model('Row', schema);
