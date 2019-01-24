const express = require('express');
const router = express.Router();

const admin_location_controller = require('../../controllers/admin_panel/location')

router.get('/', admin_location_controller.get_locations)

module.exports = router;