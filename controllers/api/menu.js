//Menu Models
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const Ingredient = require('../../models/ingredient');
const server_error = {message: 'There was a problem...'};

////////////////////////
//  Menu Controllers  //
////////////////////////

//Get all Menus 
exports.get_menus = (req, res) => {
    Menu.find({}, (err, docs) => {
        if (err){
            if (!docs){
                res.status(404).send({status: 404, message: 'No menus found'});
            } else {
                res.status(500).send(server_error);
            }
        } else {
            if (docs.length === 0) {
                res.status(404).send({status: 404, message: 'No menus found'});
            } else {
                res.json(docs);
            }
        }
    });
};

exports.get_all_menus_full = (req, res) => {
    Menu.find().
    populate('categories').
    populate('locations').
    exec((err, docs) => {
        if (err) {
            if(!docs){
                res.status(404).send({status: 404, message: 'No menus found'});
            } else {
                res.status(500).send(server_error);
            }
        } else {
            if (docs.length === 0){
                res.status(404).send({status: 404, message: 'No menus found'});
            } else {
                res.json(docs)
            }
        }
    })
}

//Get Meny by ID
exports.get_menu_by_id = (req, res) => {
    Menu.findById(req.params.menu_id, (err, doc) => {
        if (err){
            if (!doc) {
                res.status(404).send({status: 404, message: `Menu ${req.params.menu_id} not found`});
            } else {
                res.status(500).send(server_error);
            }
        } else {
           if (doc.length === 0) {
               res.status(404).send({status: 404, message: `Menu ${req.params.menu_id} not found`});
           } else {
               res.json(doc);
           }
        }
    });
};

//Get Menu by ID full 
exports.get_menu_by_id_full = (req, res) => {
    let menuReq = Menu.findById(req.params.menu_id)
                  .populate('categories')
                  .populate('locations', 'nickname name')
                  .exec();
    Promise.all([menuReq])
    .then(([menu]) => {
        res.json(menu)
    }).catch((err) => {
        res.status(500).json({code: 500, error: err});
    })
}