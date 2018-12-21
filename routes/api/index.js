const express = require('express');
const router = express.Router();

//require controllers
const api_index_controller = require('../../controllers/api/index');

router.get('/', api_index_controller.get_root)

module.exports = router;