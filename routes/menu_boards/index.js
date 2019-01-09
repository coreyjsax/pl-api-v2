const express = require('express');
const router = express.Router();
//require controllers
const menu_board_controller = require('../../controllers/menu_boards/index')

router.get('/:location_id/slices/full/:menu_id/:type/:layout', menu_board_controller.location_get_by_id_untappd_custom_menu_by_id_full);

router.get('*', (req, res) => {
    res.status(400).json({code: 404, error: 'resource not found'})
});

module.exports = router;