const Location = require('../../models/location');
const request = require('request-promise-cache');
const untappd = require('../../controllers/util/untappd');
const employment = require('../../controllers/api/employment');



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
            //get untappd menus from api
            let untappd_menus = untappd.getAllUntappdFullMenusByLocation(untappdId);
            //get breezy positions from api
            let breezy_positions = employment.get_location_positions(breezyId);
            Promise.all([untappd_menus, breezy_positions])
            .then(([untappd, breezy]) => {
                var menus = [];
                var positions = [];
                for (let i=0; i < untappd.length; i++){
                    menus.push(untappd[i].menu);
                }
                payload.untappd_menus = menus;
                payload.breezy_positions = breezy;
                return payload;
            }).then((payload) => {
                res.json(payload);
            }).catch((error) => {
                return error;
            });
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
    }
}

//Untappd 
exports.untappd_get_locations = (req, res) => {
    return untappd.getUntappdLocations()
    .then((data) => {
        res.json(data);
    })
}

