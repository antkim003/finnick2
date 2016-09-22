'use strict';
var router = require('express').Router();

module.exports = router;
var _ = require('lodash');
var Cell = require('mongoose').model('Cell');
var Promise = require('bluebird');
var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', ensureAuthenticated, function (req, res, next) {
//    Cell.find().then(function(cells) {
        res.send('');
//    });
});

router.get('/tile', ensureAuthenticated, function (req, res, next) {
    res.send('');
//    Cell.find().then(function(cells) {
//        res.json(cells);
//    });
});


var gcloud = require('gcloud');
var gcs = gcloud.storage({
    projectId: 'mcomny-misc',
    keyFilename: './cert/cert.json'
});


var bucket = gcs.bucket('imp-projects');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './tmp')
    },
    filename: function (req, file, cb) {
        var filename = req.body.fob;
        if (req.body.mobile == 'true') {
            filename += '-mobile'
        }
        if (req.body.international == 'true') {
            filename += '-international'
        }
        cb(null, filename+'.jpg')
    }
})

var upload = multer({ storage: storage });

router.post('/upload', upload.single('displayImage'), function(req, res, next) {
    var filename = req.body.fob;
    if (req.body.mobile == 'true') {
        filename += '-mobile'
    }
    if (req.body.international == 'true') {
        filename += '-international'
    }
    console.log(req.body.fob);
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    bucket.upload('./tmp/'+filename+'.jpg', {
        destination: bucket.file('/finnick/homepagepreview/uploads/'+filename+'.jpg')
    }, function(err, fileresp) {
        if (err) {console.log('in upload error', err);} else {
            //copy the data
            fileresp.copy('finnick/homepagepreview/uploads/'+filename+'.jpg', function (err, copiedFile, apiResponse) {
                if (err) {
                }
                console.log('copy file was successful');
                var bucketFile = bucket.file('finnick/homepagepreview/uploads/'+filename+'.jpg');
                bucketFile.makePublic(function(err) {
                    if (err) {
                    }
                    console.log('made public')
                    res.status(200).send('Uploaded '+filename+'.jpg');
                });

            });
        }
    })
    // Create a new blob in the bucket and upload the file data.
//    var blob = bucket.file(req.file.originalname);
//    var blobStream = blob.createWriteStream();
//
//    blobStream.on('error', function (err) {
//        return next(err);
//    });
//
//    blobStream.on('finish', function () {
//        // The public URL can be used to directly access the file via HTTP.
////        imp-projects/finnick/homepagepreview/images/coat.jpg
//        var publicUrl = format(
//            'https://storage.googleapis.com/imp-projects/finnick/images',
//            bucket.name, blob.name);
//        res.status(200).send(publicUrl);
//    });
//
//    blobStream.end(req.file.buffer);
});
