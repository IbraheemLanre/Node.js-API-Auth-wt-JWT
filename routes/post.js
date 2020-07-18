const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({
        post: {
            title: 'first post',
            description: 'random data you don\'t have to access it'
        }
    });
});

module.exports = router;