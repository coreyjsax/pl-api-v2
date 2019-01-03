const express = require('express');
const router = express.Router();
//require controllers
const api_location_controller = require('../../controllers/api/locations');

router.get('/', api_location_controller.get_locations);

router.get('/untappdlocations', api_location_controller.untappd_get_locations);

router.get('/search', api_location_controller.location_get_search_tag);

router.get('/:locId/full', api_location_controller.get_location_by_id);

router.get('/:id/untappd/full', api_location_controller.location_get_by_id_untappd);

router.get('/:location_id/untappd/full/:menu_id', api_location_controller.location_get_by_id_untappd_menu_by_id_full);

router.get('*', (req, res) => {
    res.status(400).json({code: 404, error: 'resource not found'})
});

module.exports = router;