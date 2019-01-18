const express = require('express');
const router = express.Router();

//Require auth controller 
const auth_controller = require('../../controllers/auth/auth');

router.post('/', auth_controller.log_in_user);

module.exports = router;