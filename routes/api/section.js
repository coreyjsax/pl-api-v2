const express = require('express');
const router = express.Router();

//require controllers
const api_section_controller = require('../../controllers/api/section');
const tools_controller = require('../../controllers/util/tools');

router.post('/add/:section_id/items', api_section_controller.addItemsToSection);

router.post('/:menu_id/create', api_section_controller.post_section_create);



router.get('/', api_section_controller.get_all_sections);

router.get('/full', api_section_controller.get_all_sections_full);

router.get('/:menu_id', api_section_controller.get_sections_by_menu);



module.exports = router;