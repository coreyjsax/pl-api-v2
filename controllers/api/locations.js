const Location = require('../../models/location');
const request = require('request-promise-cache');
const untappd = require('../../controllers/util/untappd');
const employment = require('../../controllers/api/employment');
const foodtec = require('../../controllers/util/foodtec');
const server_error = {message: 'There was a problem...'};

//Get all locations
exports.get_locations = (req, res) => {
    Location.find({}, (err, docs) => {
        if (err) {
            if (!docs){
                res.status(404).send({status: 404, message: 'No locations found'});
            } else {
                res.status(500).send({message: 'There was a problem...'});
            }
        } else {
            if (docs.length === 0) {
                res.status(404).send({status: 404, message: 'No locations found'});
            } else {
                res.json(docs);
            }
        }
    });
};

//Get location by ID
exports.get_location_by_id = (req, res) => {
    let payload = {};
    //Get location from database
    Location.findById(req.params.locId, (err, doc) => {
        if (err) {
            if (!doc){
                res.status(404).send({status: 404,message: 'Location not found'});
            }
            else {
                res.status(500).send({status: 500,message: 'something went wrong'});
            }
        } else {
            payload.location = doc;
            let untappdId = doc.meta_data.untappd_id;
            let breezyId = doc.meta_data.breezy_id;
            let foodtecId = doc.meta_data.foodtec_id;
            //get untappd menus from api
            let untappd_menus = untappd.getAllUntappdFullMenusByLocation(untappdId);
            //get breezy positions from api
            let breezy_positions = employment.get_location_positions(breezyId);
            let delivery_area = foodtec.getDeliveryArea(foodtecId);
            Promise.all([untappd_menus, breezy_positions, delivery_area])
            .then(([untappd, breezy, delivery]) => {
                var menus = [];
                var positions = [];
                for (let i=0; i < untappd.length; i++){
                    menus.push(untappd[i].menu);
                }
                payload.untappd_menus = menus;
                payload.breezy_positions = breezy;
                payload.delivery_area = delivery;
                return payload;
            }).then((payload) => {
                res.json(payload);
            }).catch((error) => {
                return error;
            });
        }
    });
};

//GET - Get Location by Tag Search Term //
exports.location_get_search_tag = (req, res) => {
    Location.find(req.query, (err, docs) => {
        if (err){
            if (!docs){
                res.status(404).send({status: 404, message: `No location found matching this query`});
            } else {
                res.status(500).send(server_error);
            }
        } else {
            if (docs.length === 0){
                res.status(404).send({status: 404, message: `No location found matching this query`});
            } else {
                res.json(docs);
            }
        }
    })
}

//GET - Get Location by ID and Untappd Menus //
exports.location_get_by_id_untappd = (req, res) => {
    let payload = {};
    Location.findById(req.params.id, (err, doc) => {
        if (err){
            if (!doc){
                res.status(404).send({status: 404, message: `location ${req.params.id} not found`});
            } else {
                res.status(500).send(server_error);
            }
        } else {
            if (doc.length === 0) {
                res.status(404).send({status: 404, message: `location ${req.params.id} not found`});
            } else {
                payload.location = doc;
                let untappdId = doc.meta_data.untappd_id;
                let untappd_menus = untappd.getAllUntappdFullMenusByLocation(untappdId);
                Promise.all([untappd_menus])
                .then(([untappd]) => {
                    let menus =[];
                    for (let i = 0; i < untappd.length; i++) {
                        menus.push(untappd[i].menu);
                    }
                    payload.untappd_menus = menus;
                    return payload;
                }).then((paylaod) => {
                    res.json(payload);
                }).catch((error) => {
                    res.status(500).send({status: 500, message: error});
                });
            }
        }
    });
};

//GET - Get Location by ID and Full Untappd Menu by ID //
exports.location_get_by_id_untappd_menu_by_id_full = (req, res) => {
    let payload = {};
    Location.findById(req.params.location_id, (err, doc) => {
        if (err){
            if (!doc){
                res.status(404).send({status: 404, message: `location ${req.params.id} not found`});
            } else {
                res.status(500).send(server_error);
            }
        } else {
            if (doc.length === 0) {
                res.status(404).send({status: 404, message: `location ${req.params.id} not found`});
            } else {
                payload.location = doc;
                let menu_id = req.params.menu_id;
                let untappd_menu = untappd.getUntappdMenuById(menu_id);
                Promise.all([untappd_menu])
                .then(([untappd]) => {
                    payload.untappd_menu = untappd;
                    return payload;
                }).then((payload) => {
                    res.json(payload);
                }).catch((error) => {
                    res.status(500).send({status: 500, message: error});
                });
            }
        } 
    });
};

//Post a Location
exports.location_create_post = (req, res) => {
    let new_location = {
        name: req.body.name,
        nickname: req.body.nickname,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip_code,
        phone: req.body.phone_number,
        meta_data: {
            breezy_id: req.body.breezy_id,
            untappd_id: req.body.untappd_id,
            foodtec_id: req.body.foodtec_id,
            foodtec_req: req.body.foodtec_req,
            coordinates: {
                lng: req.body.longitude,
                lat: req.body.latitude
            }
        }, 
        image: {
            image_name: req.file.filename,
            upload_date: Date.now(),
            url: './uploads/locations/' + req.file.filename
        }
    };
};

//Untappd 
exports.untappd_get_locations = (req, res) => {
    return untappd.getUntappdLocations()
    .then((data) => {
        res.json(data);
    });
};

