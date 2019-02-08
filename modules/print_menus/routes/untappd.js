const express = require('express');
const router = express.Router();

const print_menu_controller = require('../controllers/untappd');

router.get('/', function(req, res) {
    res.send('test')
})

router.get('/:locId/:taps_id/:bottles_id', print_menu_controller.getUntappdPrintFull);

module.exports = router;