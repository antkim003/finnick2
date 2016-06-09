'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    property: {
      type: String
    }, 
    header: {
      type: String
    },
    validationType: {
      type: String
    },
    columnorder: {
      type: Number
    }
},
{
    timestamps: true
});

mongoose.model('ColumnIndex', schema);
