const express = require('express');
const router = express.Router();
const api_menu_controller = require('../../controllers/api/menu')

router.get('/', api_menu_controller.get_menus)

router.get('/full', api_menu_controller.get_all_menus_full);

router.get('*', (req, res) => {
    res.status(400).json({code: 404, error: 'resource not found'})
});

module.exports = router;