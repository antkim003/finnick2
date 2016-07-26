// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Cell = mongoose.model('Cell');
var Row = mongoose.model('Row');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = supertest(app);


describe('Rows Route', function () {
  before('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  after('Clear test database', function (done) {
    clearDB(done);
  });

  var _cell, _row;
  beforeEach(function (done) {
    Cell.create({
      rowIndex: 123,
      columnIndex: '0',
      columnName: 'women',
      data: "this is a test"
    }).then(function(cell) {
      _cell = cell;
      return Row.create( {
        entries: [_cell],
        index: 123,
        fob: 'women'
      });
    }).then(function(row) {
      _row = row;
      done()
    }, done)
  });

  describe('Unauthenticated request', function () {
    it('GET /api/rows returns 200', function (done) {
      agent.get('/api/rows').expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body).to.be.an('array');
        // expect(response.body).to.have.length(100);
        done();
      });
    });

    it('GET /api/rows/:category returns 200 and an array', function (done) {
      agent.get('/api/rows/women').expect(200).end(function(err,response) {
        if(err) return done(err);
        expect(response.body).to.be.an('array');
        expect(response.body[0].entries[0].columnName).to.equal('women');
        done();
      })
    });

  });
  describe('Authenticated request', function () {

    var loggedInAgent;

    var userInfo = {
      email: 'joe@gmail.com',
      password: 'shoopdawoop'
    };

    beforeEach('Create a user', function (done) {
      User.create(userInfo, done);
    });

    beforeEach('Create loggedIn user agent and authenticate', function (done) {
      loggedInAgent = supertest.agent(app);
      loggedInAgent.post('/login').send(userInfo).end(done);
    });

    it('GET /api/rows returns 200', function (done) {
      loggedInAgent.get('/api/rows').expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body).to.be.an('array');
        // expect(response.body).to.have.length(100);
        done();
      });
    });

  });

});
