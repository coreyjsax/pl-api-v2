//Menu Models
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const Ingredient = require('../../models/ingredient');
const Section = require('../../models/section');
const server_error = {message: 'There was a problem...'};
const agp = require('api-query-params');
const mongoose = require('mongoose');
const tools = require('../../controllers/util/tools');
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

//User.populate(user, { path: 'shortList.flat.project', model: 'Project', select: { 'name': 0, 'Floor': 0, 'flats': 0, 'towers': 0,} }

exports.get_all_menus_full = (req, res) => {
    Menu.find().
    populate('categories').
    populate('locations', 'name online_ordering_url').
    populate('sections', 'name').
    populate({
        path: 'sections',
        model: 'Section',
        
        populate: [
            {
                path: 'items', 
                model: 'Item',
                select: 'name image description prices'
            }
        ]
    }).
    
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
              /* let filtered = docs.filter(menu => {
                   return menu.sections.items.prices.type === 'reg';
                }) */
                //console.log(filtered)
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

//Delete a menu
exports.deleteMenuById = (req, res) => {
    Menu.findByIdAndRemove(req.params.menu_id, (err, doc) => {
       if(err){
           res.send(err);
       } else {
           Section.remove({menu_id: req.params.menu_id}, (err, sections) => {
               res.status(201).json({status: 201, message: `Menu ${req.params.menu_id} has been deleted`});
           })
           
       }
    });
};

//Get Menu by ID full 
exports.get_menu_by_id_full = (req, res) => {
    let menuReq = Menu.findById(req.params.menu_id)
                  .populate('categories')
                  .populate('locations', 'nickname name')
                  .populate('sections', 'name, items')
                  .exec();
    
    menuReq
    .then((menu) => {
        res.json(menu)
    }).catch((err) => {
        res.status(400).json({code: 400, error: err});
    })
}

exports.post_new_menu = (req, res) => {
    
    const menu = {
        name: req.body.name,
        description: req.body.description,
        categories: req.body.categories,
        locations: req.body.locations,
        order_type: req.body.order_type, 
        menu_items: req.body.menu_items,
    }
    
    Menu.create(menu, (err, newMenu) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(201).json({status: 201, data: newMenu});
        }
    })
}

exports.filterMenus = (req, res) =>  {
  
    let promise = tools.docIdsByQuery(req.params.model, req.query)
    promise.then((idArray) => {
        res.json(idArray)
    });
 
}






