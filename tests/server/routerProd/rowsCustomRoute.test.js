// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Cell = mongoose.model('Cell');
var Row = mongoose.model('Row');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/finnick2';

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = supertest(app);


describe('Rows Route', function () {
  before('Establish DB connection', function (done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbURI, done);
  });

  it('GET /api/rows/men/repurposed', function (done) {
    agent.get('/api/rows/men/repurposed').expect(200)
      .end(function(err, response) {
        if (err) return done(err);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.equal(200);
        done();
      })
  });
});
