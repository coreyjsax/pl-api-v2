const express = require('express');
const router = express.Router();
//require controllers
const api_location_controller = require('../../controllers/api/locations');

router.get('/', api_location_controller.get_locations);

router.get('/untappdlocations', api_location_controller.untappd_get_locations);

router.get('/:locId', api_location_controller.get_location_by_id);

module.exports = router;