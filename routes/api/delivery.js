const express = require('express');
const router = express.Router();

//require controllers
const api_delivery_controller = require('../../controllers/api/delivery');
const tools_controller = require('../../controllers/util/tools');

router.get('/area/all', api_delivery_controller.get_all_areas);

router.get('/area/:store/:color', api_delivery_controller.get_one_area);

router.get('/test', api_delivery_controller.get_all_areas_processor);


module.exports = router;
