const express = require('express');
const router = express.Router();

//require controllers
const api_category_controller = require('../../controllers/api/category');
const tools_controller = require('../../controllers/util/tools');

router.get('/', api_category_controller.get_categories);

router.get('/:id', api_category_controller.get_category_by_id);

router.post('/create', tools_controller.upload_category.single('imagename'), api_category_controller.post_category_create);

router.delete('/:id', api_category_controller.delete_category);

router.put('/:id', tools_controller.upload_category.single('imagename'), api_category_controller.edit_category);

module.exports = router;