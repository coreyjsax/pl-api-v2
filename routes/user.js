const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/api/users')

//Get users listing
router.get('/', user_controller.get_all_users);

router.post('/new', user_controller.post_user_create);

//Get user profile
router.get('/profile', function(req, res, next){
    res.send(req.user)
});

module.exports = router;