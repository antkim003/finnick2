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


describe('users routes /api/users', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  // CRUD ROUTES FOR USER
  let _user;
  let loggedInAgent;
  let userInfo =  {
    username: 'test',
    password: 'test'
  };
  beforeEach('create a user', function(done) {
    User.create({
      username: 'test',
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


  it('GET /:userid ', function (done) {
    agent.get('/api/users/' + _user._id)
      .expect(200)
      .end(function(err, response) {
        if (err) done(err);
        expect(response.body).to.exist;
        done();
      });
  });

  it('GET /types ', function(done) {
    loggedInAgent.get('/api/users/types')
      .expect(200)
      .end(function(err, response) {
        if(err) done(err);
        expect(response.body.types).to.be.an("array");
        expect(response.body.types[0]).to.equal("Admin");
        done()
      });
  });

  it('PUT /:userid', function(done) {
    loggedInAgent.put('/api/users/' + _user._id)
      .send({
        'username': 'test1'
      })
      .expect(200)
      .end(function(err, response) {
        if (err) done(err);
        expect(response.body.username).to.equal('test1');
        done()
      });
  });

  it('DELETE /:userid ', function(done) {
    loggedInAgent.delete('/api/users/' + _user._id)
      .expect(200)
      .end(function(err,response) {
        if (err) done(err);
        expect(response.body).to.equal('destroyed');
        done();
      });
  });

  it ('POST /', function(done) {
    loggedInAgent.post('/api/users')
      .send({
        username: 'test123',
        password: 'test',
        locked: true,
        type: 'Admin',
        lead: true
      })
      .expect(200)
      .end(function(err, response) {
        if (err) done(err);
        expect(response.body.username).to.equal('test123');
        done();
      })
  })
});
