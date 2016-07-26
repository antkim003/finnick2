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
  before('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  after('Clear test database', function (done) {
    clearDB(done);
  });

  // CRUD ROUTES FOR USER
  let _user;
  let loggedInAgent;
  let userInfo =  {
    email: 'test@test.com',
    password: 'test'
  };
  beforeEach('create a user', function(done) {
    User.create({
      email: 'test@test.com',
      password: 'test',
      locked: true,
      type: 'Admin',
      lead: true
    }).then(function(user) {
      _user = user;
      done();
    });
  });

  beforeEach('Create loggedIn user agent and authenticate', function (done) {
    loggedInAgent = supertest.agent(app);
    loggedInAgent.post('/login').send(userInfo).end(done);
  });

  describe('Combobulator UnAuthenticated Request', function () {
    it('GET /api/combobulator returns 401 unauthenticated', function (done) {
      agent.get('/api/combobulator')
        .expect(401).end(function (err, response) {
          if (err) return done(err);
          done();
      });
    });
  });

  describe('Combobulator Authenticated Request', function () {
    it('GET /api/combobulator returns 200', function (done) {
      loggedInAgent.get('/api/combobulator')
        .expect(200).end(function (err, response) {
          if (err) return done(err);
          done();
      });
    });
  });


});
