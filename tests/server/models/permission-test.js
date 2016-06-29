var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

var Permission = mongoose.model('Permission');

describe('Permission Model', function () {
  this.timeout(8000);
  beforeEach('Establish DB connection', function (done) {
      if (mongoose.connection.db) return done();
      mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
      clearDB(done);
  });

  describe('model', function () {
    it('should exist', function (done) {
      console.log('permission here');
      expect(Permission).to.be.a('function');
      done();
    });
  });


});
