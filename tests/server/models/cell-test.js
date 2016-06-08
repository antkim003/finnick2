var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Cell = mongoose.model('Cell');

describe('Cell Model', function () {
  this.timeout(4000);
  beforeEach('Establish DB connection', function (done) {
      if (mongoose.connection.db) return done();
      mongoose.connect(dbURI, done);
  });

  afterEach('clear db', function(done) {
    clearDB(done);
  });

  it('should exist', function (done) {
    expect(Cell).to.be.a('function');
    done();
  });
});