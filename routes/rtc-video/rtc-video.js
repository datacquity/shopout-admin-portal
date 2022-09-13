const router = require('express').Router();
router.use('/fetch', require('./actions/fetch'));
router.use('/register', require('./actions/register'));

// Upload a video
const uploadVideo = require('./actions/register');
router.use('/uploadVideo' , uploadVideo);

module.exports = router;
