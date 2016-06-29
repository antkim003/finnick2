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
    agent.get('/api/users/types')
      .expect(200)
      .end(function(err, response) {
        if(err) done(err);
        expect(response.body).to.be.an("array");
        done()
      });
  });

  it('PUT /:userid', function(done) {
    agent.put('/api/users/' + _user._id)
      .send({
        'email': 'test1@test.com'
      })
      .expect(200)
      .end(function(err, response) {
        if (err) done(err);
        console.log('putresponse: ', response.body);
        expect(response.body.email).to.equal('test1@test.com');
        done()
      });
  });

  it('DELETE /:userid ', function(done) {
    agent.delete('/api/users/' + _user._id)
      .expect(200)
      .end(function(err,response) {
        if (err) done(err);
        expect(response.body).to.equal('destroyed');
        done();
      });
  });

  it ('POST /', function(done) {
    agent.post('/api/users')
      .send({
        email: 'test123@test.com',
        password: 'test',
        locked: true,
        type: 'Admin',
        lead: true
      })
      .expect(200)
      .end(function(err, response) {
        if (err) done(err);
        expect(response.body.email).to.equal('test123@test.com');
        done();
      })
  })
});
