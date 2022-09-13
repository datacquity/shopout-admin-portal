const router = require('express').Router();
router.use('/actions', require('./actions'));
router.use('/fetch', require('./fetch'));
router.use('/invite', require('./invite'));

module.exports = router;
