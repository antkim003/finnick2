// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = supertest(app);


describe('columns/index Route', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('Unauthenticated request', function () {
    it('GET /api/columns/index returns 200', function (done) {
      agent.get('/api/columns/index').expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body).to.be.an('array');
        done();
      });
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

    it('GET /api/columns/index returns 200', function (done) {
      loggedInAgent.get('/api/columns/index').expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body).to.be.an('array');
        done();
      });
    });

  });

});