//Menu Models
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const Ingredient = require('../../models/ingredient');
const server_error = {message: 'There was a problem...'};

const tools = require('../../controllers/util/tools');
const fs = require('fs');
////////////////////////
//  Item Controllers  //
////////////////////////




//Post Item
exports.post_item_create = (req, res) => {
    
    
    let array = req.body.ingredients;
    console.log(array)
    
    let locations = req.body.locations;
   let newlocations = locations.split(',');
    console.log(newlocations)
    let newArray = array.split(',')
    console.log(newArray)
    
    let tags = req.body.tags;
    tags = tags.split(",");
    
    let order_types = req.body.order_types;
    order_types = order_types.split(",");
    
    const item = {
        name: req.body.name,
        description: [],
        locations: newlocations,
        category: req.body.category,
        order_types: order_types,
        tags: req.body.tags,
        ingredients: newArray,
        notes: req.body.notes,
        image: {
            image_name: req.file.filename,
            upload_date: Date.now(),
            url: './uploads/menus/item/' + req.file.filename
        },
        prices: []
    };
    
    for (let i = 0; i < order_types.length; i++) {
        if (order_types[i] === "dine-in") {
            item.description.push({
                order_type: order_types[i],
                description: req.body.dine_in_description
            });
        } else if (order_types[i] === "delivery"){
            item.description.push({
                order_type: order_types[i],
                description: req.body.delivery_description
            });
        } else if (order_types[i] === "carry-out"){
             item.description.push({
                order_type: order_types[i],
                description: req.body.carry_out_description
            });
        } else {
            
        }
    }
    
    function sortPrices(category, tags){
            category = category.toLowerCase()
            console.log(tags)
            switch (category) {
              
                case 'appetizers':
                     console.log('appetizers')
                     item.prices.push(
                         {
                            type: "reg",
                            id: "reg",
                            text: "Regular",
                            amount: req.body.reg
                         },
                         {
                             type: "party",
                             id: "party",
                             text: "Party Size",
                             amount: req.body.party
                         }
                         );
                    for (var a = 0; a < tags.length; a++){
                        if (tags[a] === "VR") {
                           item.prices.push(
                                {
                                    type: "vegan",
                                    id: "V",
                                    text: "Get it Vegan",
                                    amount: req.body.vegan
                                },
                                {
                                    type: "vegan_party",
                                    id: "VPS",
                                    text: "Vegan Party Size",
                                    amount: req.body.vegan_party
                                }
                            );
                        } else if (tags[a] === "GFR") {
                            item.prices.push(
                                {  
                                    type: "gluten_free_on_request",
                                    id: "GFR",
                                    text: "Get it GF",
                                    amount: req.body.gluten_free_on_request
                                },
                                {   
                                    type: "gluten_free_on_request_party",
                                    id: "GFRPS",
                                    text: "GF Party Size",
                                    amount: req.body.gluten_free_on_request_party
                                }
                            );
                        }
                    }
                    
                    break;
                case 'salads':
                    item.prices.push(
                        {   
                            type: 'sm',
                            id: 'sm',
                            text: "Sm",
                            amount: req.body.sm
                        },
                        {   
                            type: "lg",
                            price: "lg",
                            text: "Lg",
                            amount: req.body.lg
                        },
                        {   type: "party",
                            id: "PS",
                            text: "Party Size",
                            amount: req.body.party
                        }
                    );
                    break;
                case 'pasta': 
                    item.prices.push(
                        {   type: 'reg',
                            id: "reg",
                            text: "Regular",
                            amount: req.body.reg
                        },
                        {   type: 'party',
                            id: "ps",
                            text: "Party Size",
                            amount: req.body.party
                        }
                    );
                    break;
                case 'parmigiana hoagies':
                    item.prices.push(
                        {   type: 'reg',
                            id: "reg",
                            text: "Regular",
                            amount: req.body.reg
                        }
                    );
                    break;
                case 'deli style hoagies':
                   item.prices.push({
                            type: 'reg',
                            id: "reg",
                            text: "Regular",
                            amount: req.body.reg
                        });
                    break;
                case 'specialty pizza':
                   item.prices.push(
                        {   type: 'sm',
                            id: 'sm | 10"',
                            text: 'Sm | 10"',
                            amount: req.body.sm
                        },
                        {
                            type: 'med',
                            id: 'med | 12"',
                             text: 'Med | 12"',
                            amount: req.body.med
                        },
                        {
                            type: 'lg',
                            id: 'lg| 16"',
                             text: 'Lg | 16"',
                            amount: req.body.lg
                        }
                    );
                    for (var b = 0; b < tags.length; b++){
                        if (tags[b] === "GFR") {
                            item.prices.push({
                                type: 'gf',
                            id: 'gf | 10"',
                             text: 'GF | 10"',
                            amount: req.body.gf
                            })
                        }
                    }
                    break;
                case 'desserts':
                   item.prices.push({
                            type: 'reg',
                            id: "reg",
                            text: "Regular",
                            amount: req.body.reg
                        })
                    for (var c = 0; c < tags.length; c++) {
                        if (tags[c] === "lg_party") {
                            item.prices.push({
                                type: 'party',
                                id: 'PS',
                                text: "Party Size",
                                amount: req.body.party
                            })
                        }
                    }
                    break;
                default:
            }
        }
        sortPrices(req.body.category, tags)
    
    Item.create(item, (err, newlyCreated) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).send({status: 200, message: 'Post succeeded', data: newlyCreated})
            }
        })
}


//Delete and item
exports.delete_item = (req, res) => {
    Item.findByIdAndRemove(req.params.id, (err, item) => {
        if (err) {
            res.status(404).send({status: 404, message: 'No items found'});
        } else {
            let image_id = item.image.image_name;
            let image_path = item.image.url;
            fs.unlink('./public/' + image_path, function(err){
                if (err){
                    console.log(err);
                }
                console.log('file has been deleted')
            })
             res.status(200).send({status: 200, message: 'Item deleted', data: item})
        }
    })
}


exports.get_items_all = (req, res) => {
    Item.find({}, (err, docs) => {
        if (err) {
            if (!docs){
                res.status(404).send({status: 404, message: 'No items found'});
            } else {
                res.status(500).send(server_error)
            }
        } else {
            if (docs.length === 0) {
                res.status(404).send({status: 404, message: 'No items found'});
            } else {
                res.json(docs)
            }
        }
    })
}

exports.get_items_all_full = (req, res) => {
    Item.find().
    populate('ingredients', 'name id updated type tags').
    populate('locations', 'nickname name id').
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
            console.log(err);
        } else {
                let filtered = [];
                for (var i = 0; i < results.length; i++){
                    for (var j = 0; j < results[i].ingredients.length; j++){
                        if (results[i].ingredients[j].name == req.params.name){
                            filtered.push(results[i]);
                        }
                    }
                }
                let stuff = tools.tools.removeDuplicates(filtered);
                res.json(stuff);
        }
    });
};

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
};



exports.get_array_items_by_search = (req, res) => {
    Item.find().
    populate('ingredients').
    populate('locations').
    exec((err, results) => {
        if (err) {
            console.log(err);
        } else {
            let query = req.query;
                query = exports.filterArrays(results, query);
            
            let data = {
                search: query,
                results: results
            };
            let finalData = exports.filterResults(data, data.search);
            
            res.json(data);
        }
    });
};

exports.filterArrays = (results, query) => {
    let data = {};
    let queryKeys = Object.keys(query);
    let queryArray = [];
    let queryObj = {};
    
    data.params = queryKeys;
    data.query = query;
    
    for (var key in data.query) {
        if (typeof data.query[key] === 'string'){
            data.query[key] = [data.query[key]];
        }
        queryArray.push({key: data.query[key]});
        queryObj[key] = data.query[key]
    }
    console.log(queryObj)
    data.query = queryObj;
    return data;
};

exports.filterResults = (data, search) => {
    let params = data.search.params;
    let query = data.search.query;
    let results = data.results;
    
    let collection = [];
    
    let queries = [];
    
    
    
    for (let i = 0; i < results.length; i++){
        for (let j = 0; j < results[i].ingredients.length; j++){
            
        }
    }
    
    for (let i = 0; i < results.length; i++){
        for (let j = 0; j < results[i].ingredients.length; j++){
            if (results[i].ingredients[j].name == search){
                console.log(results[i]);
            }
        }
    }
    
   /* for (var i = 0; i < data.length; i++){
                    for (var j = 0; j < data[i].ingredients.length; j++){
                       if (data[i].ingredients[j].name == req.params.search){
                            filtered.push(array[i]);
                        } 
                    }
                }
            let stuff = tools.tools.removeDuplicates(data); */
            return data; 
}

