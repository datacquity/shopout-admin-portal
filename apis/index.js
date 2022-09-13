const verifySession = require('../routes/store/auth/verifySession');
const router = require('express').Router();
router.use('/geocoding', require('./geocoding'));
router.use('/invite', require('./invite'));
router.use('/outbound-calls', verifySession, require('./outbound-calls'));

module.exports = router;
