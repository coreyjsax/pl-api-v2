const Location = require('../../models/location');
const request = require('request-promise-cache');
const untappd = require('../../controllers/util/untappd');
const employment = require('../../controllers/api/employment');
const foodtec = require('../../controllers/util/foodtec');
const server_error = {message: 'There was a problem...'};

///////////////////////////////////////
//  Admin Panel LocationControllers  //
///////////////////////////////////////

//Get all locations (card view)
exports.get_locations = (req, res) => {
    let model = 'location';
    Location.find().
    exec((err, docs) => {
        if (err) console.log(err)
            res.render('./admin/loaders/menu-cards', {items: docs, model: model})
    })
}

exports.get_location_by_id = (req, res) => {
    
}