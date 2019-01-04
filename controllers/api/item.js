//Menu Models
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const Ingredient = require('../../models/ingredient');
const server_error = {message: 'There was a problem...'};

const tools = require('../../controllers/util/tools')
////////////////////////
//  Item Controllers  //
////////////////////////

exports.post_item_create = (req, res) => {
    const item = {
        name: req.body.name,
        description: req.body.description,
        locations: req.body.locations,
        order_types: req.body.order_types,
        tags: req.body.tags,
        ingredients: req.body.ingredients,
        notes: req.body.notes,
        
    }
}

exports.get_items_all = (req, res) => {
    Item.find().
    populate('ingredients').
    populate('locations').
    exec((err, results) => {
        if (err) {
            console.log(err)
        } else {
            res.json(results)
        }
    });
}

exports.get_items_by_search = (req, res) => {
    Item.find().
    populate('ingredients').
    populate('locations').
    exec((err, results) => {
        if (err) {
            console.log(err)
        } else {
                let filtered = [];
                for (var i = 0; i < results.length; i++){
                    for (var j = 0; j < results[i].ingredients.length; j++){
                        if (results[i].ingredients[j].name == req.query){
                            filtered.push(results[i]);
                        }
                    }
                }
                let stuff = tools.tools.removeDuplicates(filtered);
                res.json(stuff);
        }
    });
}

exports.search_items = (array, filters) => {
 /*   
            let filtered = [];
            for (var i = 0; i < array.length; i++){
                    for (var j = 0; j < array[i].ingredients.length; j++){
                        if (array[i].ingredients[j].name == req.params.search){
                            filtered.push(array[i]);
                        } 
                    }
                }
            let stuff = tools.tools.removeDuplicates(filtered);
            return stuff; */
}



exports.get_array_items_by_search = (req, res) => {
    Item.find().
    populate('ingredients').
    populate('locations').
    exec((err, results) => {
        if (err) {
            console.log(err);
        } else {
            let query = req.query;
            let test = exports.filterArrays(results, query)
            res.json(test)
        }
    })
}

exports.filterArrays = (results, query) => {
    let data = {};
    let queryKeys = Object.keys(query);
    let queryArray = [];
    
    data.params = queryKeys;
    data.query = query;
    
    for (var key in data.query) {
        if (typeof data.query[key] === 'string'){
            data.query[key] = [data.query[key]]
        }
        queryArray.push({[key]: data.query[key]})
    }
    
    data.query = queryArray;
    
    
  /*  
    if (query.name) {
        if (query.name.length === 1){
            data.query.name = query.name;
        } else {
            data.query.name = [];
            for (let i = 0; i < query.name.length; i++){
                data.query.push(query.name[i]);
            }
        }
    }
    */
    
    
    
    
    return data;
}