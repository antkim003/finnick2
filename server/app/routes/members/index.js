'use strict';
var router = require('express').Router();
var User = require('mongoose').model('User');
module.exports = router;
var _ = require('lodash');
var jwt = require('jwt-simple');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

function tokenForUser(user) {
  var timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, 'secret');
}

var findUserType = function(req, res, next) {
    User.findById(req.session.passport.user).then(function(user) {
        req.session.user = user;
        next();
    }, next)
}

router.get('/', findUserType, function(req, res, next) {
    console.log('req.session.user.type', req.session.user.type);
    if (req.session.user.type === "admin") {
        console.log('admin user means everyone');
        User.find().then(function(users) {
            console.log('here are the users', users);
            res.json(users);
        });
    } else {
        console.log('nonadmin user');
        User.find({type: req.session.user.type})
            .then(function(users) {
                console.log('here are the users', users);
                res.json(users);
            });
    }
});

router.get('/session', function (req, res) {
    if (req.user) {
        var obj = {
                    user: req.user.sanitize(),
                    token: tokenForUser(req.user)
                  };
        res.json(obj);
    } else {
        res.status(401).send('No authenticated user.');
    }
});


router.get('/secret-stash', ensureAuthenticated, function (req, res) {

    var theStash = [
        'http://ep.yimg.com/ay/candy-crate/bulk-candy-store-2.gif',
        'http://www.dailybunny.com/.a/6a00d8341bfd0953ef0148c793026c970c-pi',
        'http://images.boomsbeat.com/data/images/full/44019/puppy-wink_1-jpg.jpg',
        'http://p-fst1.pixstatic.com/51071384dbd0cb50dc00616b._w.540_h.610_s.fit_.jpg',
        'http://childcarecenter.us/static/images/providers/2/89732/logo-sunshine.png',
        'http://www.allgraphics123.com/ag/01/10683/10683.jpg',
        'http://img.pandawhale.com/post-23576-aflac-dancing-duck-pigeons-vic-RU0j.gif',
        'http://www.eveningnews24.co.uk/polopoly_fs/1.1960527.1362056030!/image/1301571176.jpg_gen/derivatives/landscape_630/1301571176.jpg',
        'http://media.giphy.com/media/vCKC987OpQAco/giphy.gif',
        'https://my.vetmatrixbase.com/clients/12679/images/cats-animals-grass-kittens--800x960.jpg',
        'http://www.dailymobile.net/wp-content/uploads/2014/10/lollipops.jpg'
    ];

    res.send(_.shuffle(theStash));

});
