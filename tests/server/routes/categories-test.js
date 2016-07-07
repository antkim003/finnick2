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
describe('categories Route', function () {
  before('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  after('Clear test database', function (done) {
    clearDB(done);
  });

  var _cell;
  beforeEach('cell model', function(done) {
    Cell.create({
      rowIndex: '123',
      columnIndex: '0',
      columnName: 'category',
      data: "women"
    }).then(function(cell) {
      _cell = cell;
      done();
    }, done)
  });

  it('GET api/categories/ returns all categories', function (done) {
    agent.get('/api/categories')
      .expect(200)
      .end(function(err, resp){
        if (err) return done(err)
        expect(resp.body.categories[0]).to.eql('women');
        done();
      });
  });

});
