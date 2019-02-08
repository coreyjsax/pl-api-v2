const Location = require('../../../models/location');
const request = require('request-promise-cache');
const Untappd = require('../controllers/untappd');
const Util = require('../../../controllers/util/untappd');
const fs = require('fs');

//render beer menu template taps & cans/bottles
exports.getUntappdPrintFull = (req, res) => {
    let payload = {};
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
            
            let tapMenuId = req.params.taps_id;
            let bottlesCansId = req.params.bottles_id;
            let tapMenu = Util.getUntappdMenuById(tapMenuId);
            let bottlesCansMenu = Util.getUntappdMenuById(bottlesCansId);
            
            Promise.all([tapMenu, bottlesCansMenu])
            .then(([taps, bottles]) => {
                payload.taps_menu = taps;
                payload.bottles_cans_menu = bottles;
                return payload;
            }).then((payload) => {
               res.render('../modules/print_menus/views/print_2up_full', payload);
               //res.json(payload)
            });
        }
    });
};