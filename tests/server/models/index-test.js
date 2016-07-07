var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var ColumnIndex = mongoose.model('ColumnIndex');
var RowIndex = mongoose.model('RowIndex');

describe('preConnect', function () {
  before('Establish DB connection', function (done) {
      if (mongoose.connection.db) return done();
      mongoose.connect(dbURI, done);
  });

  after('clear db', function(done) {
    clearDB(done);
  });

  describe('ColumnIndex Model', function () {
    it('should exist', function (done) {
      this.timeout(4000);
      expect(ColumnIndex).to.be.a('function');
      done();
    });
  });
  describe('RowIndex Model', function () {
    it('should exist', function (done) {
      this.timeout(4000);
      expect(RowIndex).to.be.a('function');
      done();
    });
  });
});
