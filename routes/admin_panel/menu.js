const express = require('express');
const router = express.Router();
const admin_menu_controller = require('../../controllers/admin_panel/menu');

router.get('/menu', admin_menu_controller.get_menus);


router.get('/item', admin_menu_controller.get_items);



router.get('/items/test', admin_menu_controller.get_items_search_test)

router.get('/category', admin_menu_controller.get_categories);

router.get('/ingredient', admin_menu_controller.get_ingredients);

router.get('/:model/search', admin_menu_controller.get_items_search_test);


router.get('*', (req, res) => {
    res.status(400).json({code: 404, error: 'resource not found'})
});

module.exports = router;