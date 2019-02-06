const express = require('express');
const router = express.Router();
const api_menu_controller = require('../../controllers/api/menu')

router.get('/', api_menu_controller.get_menus)

router.get('/full', api_menu_controller.get_all_menus_full);

router.get('/search/:model', api_menu_controller.filterMenus)

router.get('/:menu_id/full', api_menu_controller.get_menu_by_id_full);

router.post('/create', api_menu_controller.post_new_menu);

router.delete('/:menu_id', api_menu_controller.deleteMenuById);

router.get('*', (req, res) => {
    res.status(400).json({code: 404, error: 'resource not found'})
});

module.exports = router;