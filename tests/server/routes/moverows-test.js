// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Cell = mongoose.model('Cell');
var Row = mongoose.model('Row');
var Promise = require('bluebird');
var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = supertest(app);


describe('Move Rows Test', function () {
    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });


    var _wmfobcell,
        _menfobcell,
        _womenrow,
        _menrow;

    beforeEach('Create row', function(done){


        Promise.all([
            Cell.create([{rowIndex: 1, columnIndex: 1, columnName:'name',data:'test cell', fob:'women'}]),

            Cell.create([{rowIndex: 1, columnIndex: 1, columnName:'name',data:'men test cell 1', fob:'men'},
                {rowIndex: 2, columnIndex: 1, columnName:'name',data:'men test cell 2', fob:'men'}]),

            Row.create({
                entries: [],
                index: 1,
                fob: 'women'
            }),

            Row.create([{
                entries: [],
                index: 1,
                fob: 'men'
            },
            {
                entries: [],
                index: 2,
                fob: 'men'
            }])
        ]).spread(function(wmfobcell, menfobcell, womenrow, menrow){
           console.log(wmfobcell, menfobcell, womenrow, menrow);

            womenrow.entries.push(wmfobcell[0]);
            menrow[0].entries.push(menfobcell[0]);
            menrow[1].entries.push(menfobcell[1]);

            _wmfobcell = wmfobcell;
            _menfobcell = menfobcell;
            _womenrow = womenrow;
            _menrow = menrow;

           return Promise.all([
               womenrow.save(),
               menrow[0].save(),
               menrow[1].save()
           ])

        }).then(function(){
            console.log('in the then')
            done();
//            setTimeout(done, 15000);

        }).catch(console.error)



    })

    it ('text', function(done) {
        var killCell = {"_id":'newcell'};
        var params = [{"row": _womenrow._id, "fromFOB": _womenrow.fob, "toFOB": 'men', "killCell": killCell._id}];
//        done();

        agent.post('/api/rows/moverow')
//            .set('Content-Type', 'application/json')
            .send(params)
//            .expect(200, done);
            .expect(200)
            .end(function(err, response) {
//                console.log('in res', response)
                expect(response.body.index).to.equal(3);
                done();
            });

    });

});
