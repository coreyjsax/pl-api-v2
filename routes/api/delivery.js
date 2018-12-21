const express = require('express');
const router = express.Router();

//require controllers
const api_delivery_controller = require('../../controllers/api/delivery')



router.get('/area/:store/:color', api_delivery_controller.get_one_area)

module.exports = router;