const Location = require('../../models/location');
const request = require('request-promise-cache');
const untappd = require('../../controllers/util/untappd');
const employment = require('../../controllers/api/employment');
const foodtec = require('../../controllers/util/foodtec');
const server_error = {message: 'There was a problem...'};

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

//Get - Get Location by ID and Full Custom Untapd Menu by ID //
exports.location_get_by_id_untappd_custom_menu_by_id_full = (req, res) => {
    let locationReq = Location.findById(req.params.location_id).exec();
    let customMenuReq = untappd.getCustomMenuById(req.params.menu_id);
    
    Promise.all([locationReq, customMenuReq])
    .then(([location, sliceMenu]) => {
        let data = {};
            data.location = location;
            data.sliceMenu = sliceMenu;
            return data;
    }).then((data) => {
       res.render(`menu_boards/${req.params.type}_${req.params.layout}`, {location: data.location, slices: data.sliceMenu})
       //res.json(data)
    }).catch((error) => {
        res.status(500).send({status: 500, message: error});
    })
    
}