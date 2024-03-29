'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var User = mongoose.model('User');

function tokenForUser(user) {
  var timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, 'secret');
}

module.exports = function (app) {

    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    var strategyFn = function (username, password, done) {
      console.log('username asdf: ', username);
        User.findOne({ username: username })
            .then(function (user) {
                // user.correctPassword is a method from the User schema.
                if (!user || !user.correctPassword(password)) {
                    done(null, false);
                } else {
                    // Properly authenticated.
                    done(null, user);
                }
            })
            .catch(done);
    };

    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, strategyFn));

    // A POST /login route is created to handle login.
    app.post('/login', function (req, res, next) {

        var authCb = function (err, user) {

            if (err) return next(err);

            if (!user) {
                var error = new Error('Invalid login credentials.');
                error.status = 401;
                return next(error);
            }

            // req.logIn will establish our session.
            req.logIn(user, function (loginErr) {
                if (loginErr) return next(loginErr);
                // We respond with a response object that has user with _id and email.
                res.status(200).send({
                    user: user.sanitize(),
                    token: tokenForUser(user)
                });
            });

        };

        passport.authenticate('local', authCb)(req, res, next);

    });

};
