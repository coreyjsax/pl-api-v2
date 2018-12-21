const express = require('express');
const router = express.Router();

//require controllers
const api_employment_controller = require('../../controllers/api/employment');

//Test Route
router.get('/test', api_employment_controller.test)

module.exports = router;