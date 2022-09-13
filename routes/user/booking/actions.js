const router = require('express').Router();
router.use('/create', require('./controllers/create').router);
router.use('/approve', require('./controllers/approve'));
router.use('/cancel', require('./controllers/cancel'));
router.use('/edit', require('./controllers/edit'));
router.use('/friends', require('./controllers/friends'));

module.exports = router;
