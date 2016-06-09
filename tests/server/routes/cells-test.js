// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Cell = mongoose.model('Cell');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = supertest(app);


describe('cell routes /api/cells', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });
  var _cell;
  beforeEach('cell model', function(done) {
    Cell.create({
      rowIndex: '123',
      columnIndex: '0',
      columnName: 'womens',
      data: "this is a test"
    }).then(function(cell) {
      _cell = cell;
      done();
    }, done)
  });

  it('GET /:id returns 200', function (done) {
    agent.get('/api/cells/' + _cell._id)
      .expect(200)
      .end(function(err, response) {
      if (err) done(err)
      expect(response.body._id.toString()).to.equal(_cell._id.toString());
      done();
    });
  });

  it('PUT / with one product returns 200 and the updated cells', function (done) {
    agent.put('/api/cells')
      .send([{
        _id: _cell._id,
        data: 'this was modified from test'
      }])
      .expect(200)
      .end(function(err, response) {
        if (err) done(err)
        expect(response.body).to.have.length(1);
        expect(response.body[0].data).to.equal("this was modified from test");
      });
      done();
  });
});