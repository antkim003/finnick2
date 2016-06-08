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


describe('Rows Route', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('Unauthenticated request', function () {
    it('GET /api/rows returns 200', function (done) {
      agent.get('/api/rows').expect(200).end(function (err, response) {
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

    it('GET /api/rows returns 200', function (done) {
      loggedInAgent.get('/api/rows').expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body).to.be.an('array');
        done();
      });
    });

    it('PUT /api/rows returns 200', function (done) {
      loggedInAgent.put('/api/rows')
        .send(
          {
            "name":"dapibus nulla suscipit ligula in lacus curabitur",
            "sortnumber":3,
            "id":2,
            "category":"women",
            "notesoncategory":"Phasellus id sapien in sapien iaculis congue.",
            "doubleexposure":"women",
            "instorespecial":"Morbi non quam nec dui luctus rutrum.",
            "storeregprice":"$6.99",
            "storespecialprice":"$7.97",
            "mcomspecial":"eleifend pede libero quis orci nullam molestie nibh",
            "pricinginfo":"Custom",
            "mcomregprice":"$2.29",
            "mcomspecialprice":"$7.31",
            "pricingcomments":"All Sizes",
            "markettointernational":true,"projectedunits":3771,"projectedsales":"$80508.75",
            "salesfor2015":"$43966.69",
            "imageid":237226,"arimageid":971434,"singleormultiple":"Multiple",
            "tileimage":912548,"tilecopy1":"YOUR CHOICE",
            "tilecopy2":"ipsum praesent",
            "tilecopy3":"ut massa quis augue luctus tincidunt nulla mollis",
            "tilecopy4":"enim leo rhoncus sed vestibulum sit amet",
            "tilestyle":1,"bffavorites":false,
            "goingfast":true,
            "alsoinpetites":false,
            "petitessavedset":1110,
            "needsavedset":false,
            "linktype":"category (c)",
            "livedate":"10/15/2016",
            "categoryid":1158,
            "productid":4732,
            "url":"/orci/luctus/et/ultrices/posuere.jsp",
            "petiteslinktype":"product (p)",
            "petitescategoryid":9359,"petitesproductid":2265,"petitesurl":"/proin/risus/praesent/lectus/vestibulum/quam/sapien.aspx",
            "omniprojectedsales":"$34350.68",
            "extraomniprojectedsales":"$17832.73"
          }
        )
        .expect(200)
        .end(function(err, response) {
          if (err) return done(err);
          expect(response.body).to.exist;
          done();
        });
    });

  });

});