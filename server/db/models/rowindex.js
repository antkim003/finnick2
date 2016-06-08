'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    rows: {
      type: Array
    }
},
{
    timestamps: true
});

mongoose.model('RowIndex', schema);
