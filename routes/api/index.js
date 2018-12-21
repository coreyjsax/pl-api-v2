const express = require('express');
const router = express.Router();

//require controllers
const api_index_controller = require('../../controllers/api/index');

//Index Route
router.get('/', api_index_controller.get_root);

//Get Gift Card Balance or History
router.get('/giftcards/:card/:pin/:query', api_index_controller.get_giftcard_data);

module.exports = router;