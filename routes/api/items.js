const express = require('express');
const router = express.Router();
//require controllers

const api_item_controller = require('../../controllers/api/item');

router.get('/', api_item_controller.get_items_all);

router.get('/full', api_item_controller.get_items_all_full);

//router.get('/search', api_item_controller.get_items_by_search);

router.get('/:name', api_item_controller.get_items_by_search);


module.exports = router;