const express = require('express');
const router = express.Router();
//require controllers

const api_item_controller = require('../../controllers/api/item');
const tools_controller = require('../../controllers/util/tools');

router.get('/', api_item_controller.get_items_all);

router.post('/test', tools_controller.upload_item.single('imagename'), api_item_controller.post_test);

router.post('/create', tools_controller.upload_item.single('imagename'), api_item_controller.post_item_create)

router.get('/full', api_item_controller.get_items_all_full);

router.delete('/:id', api_item_controller.delete_item);

//router.get('/search', api_item_controller.get_items_by_search);

router.get('/:name', api_item_controller.get_items_by_search);


module.exports = router;