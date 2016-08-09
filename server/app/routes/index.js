'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/columns', require('./columns'));
router.use('/rows', require('./rows'));
router.use('/cells', require('./cells'));
router.use('/categories', require('./categories'));
router.use('/users', require('./users'));
router.use('/combobulator', require('./combobulator'));
router.use('/permissions', require('./permissions'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
