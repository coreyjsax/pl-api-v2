//Menu Models
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const Ingredient = require('../../models/ingredient');
const server_error = {message: 'There was a problem...'};

///////////////////////////////
//  Ingredients Controllers  //
///////////////////////////////

//POST - Create Ingredient //
exports.ingredient_create_post = (req, res) => {
    const new_ingredient = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        tags: req.body.tags,
        updated: Date.now(),
        cost: req.body.cost,
        notes: req.body.notes,
        meta: {
            color: req.body.color
        }
    };
    Ingredient.create(new_ingredient, (err, newlyCreated) => {
        if (err){
            res.status(500).send(server_error);
        } else {
            res.status(200).send({
                status: 200,
                data: new_ingredient
            });
        }
    });
};

//GET - Get all Ingredients //
exports.ingredient_get_all = (req, res) => {
    Ingredient.find({}, (err, docs) => {
        if (err) {
            if (!docs){
                res.status(404).send({status: 404, message: 'No ingredients found'});
            } else {
                res.status(500).send(server_error);
            } 
        } else {
            if (docs.length === 0) {
                res.status(404).send({status: 404, message: 'No ingredients found'});
            } else {
                res.json(docs);
            }
        }
    });
};

//GET - Get Ingredients by Tag Search Term //
exports.ingredient_get_search_tag = (req, res) => {
    Ingredient.find(req.query, (err, docs) => {
        if (err){
            if (!docs){
                res.status(404).send({status: 404, message: `Ingredient ${req.query} not found`});
            } else {
                res.status(500).send(server_error);
            }
        } else {
            if (docs.length === 0){
                res.status(404).send({status: 404, message: `Ingredient ${req.query} not found`});
            } else {
                res.json(docs);
            }
        }
    });
};

//GET - Get Ingredient by ID //
exports.ingredient_get_id = (req, res) => {
    Ingredient.findById(req.params.id, (err, doc) => {
        if (err){
            if (!doc){
                res.status(404).send({status: 404, message: `Ingredient ${req.params.id} not found`});
            } else {
                res.status(500).send(server_error);
            }
        } else {
            if (doc.length === 0) {
                res.status(404).send({status: 404, message: 'Ingredient not found'});
            } else {
                res.json(doc);
            }
        }
    });
};

//EDIT - Get Ingredient by ID and Update //
exports.ingredient_put_id = (req, res) => {
    Ingredient.findByIdAndUpdate(req.params.id, req.body, (err, doc) => {
        if (err){
            if (!doc){
                res.status(404).send({status: 404, message: `Ingredient ${req.params.id} not found`});
            } else {
                res.status(500).send(server_error)
            }
        } else {
            if (doc.length === 0){
                res.status(404).send({status: 404, message: 'Ingredient not found'});
            } else {
                res.status(200).send({
                    status: 200,
                    data: doc
                });
            }
        }
    })
}

