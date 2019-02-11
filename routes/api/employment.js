const express = require('express');
const router = express.Router();

//require controllers
const api_employment_controller = require('../../controllers/api/employment');

//Test Route
router.get('/test', api_employment_controller.test);

//Get Company Position Categories
router.get('/category', api_employment_controller.get_positions_categories);

//Get all Positions
router.get('/positions/all', api_employment_controller.get_all_positions);

//Filter Positions by State
router.get('/positions/all/:state', api_employment_controller.get_all_positions);

//Filter Positions by Location
router.get('/positions/:location', api_employment_controller.get_positions_by_loc);

//Filter Positions by Location && State
router.get('/positions/:location/:state', api_employment_controller.get_positions_by_loc);

router.post('/positions/create', api_employment_controller.postNewPosition);

router.put('/positions/edit/:pos_id/:state', api_employment_controller.editPositionState);




module.exports = router;