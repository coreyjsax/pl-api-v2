//Menu Models
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const ItemTest = require('../../models/item_test');
const Ingredient = require('../../models/ingredient');
const Section = require('../../models/section');
const server_error = {message: 'There was a problem...'};
const {body} = require('express-validator/check');
const tools = require('../../controllers/util/tools');
const fs = require('fs');
////////////////////////
//  Item Controllers  //
////////////////////////

exports.get_items_search = (req, res) => {
    Item.find()
    .populate('ingredients.list')
    .populate('locations')
    .exec((err, docs) => {
        if (err) {
            console.log(err);
        } else {
            console.log(req.query);
            res.json(docs)
        }
           
    })
}


exports.post_test2 = (req, res) => {
    let item = {
        name: req.body.name,
        prices: req.body.price
    };
     
    console.log(req.body)
    res.json('hi')
}



exports.post_test = (req, res) => {
    const item = {
        name: req.body.name,
        description: [],
        locations: req.body.locations,
        order_types: req.body.order_type,
        tags: req.body.tags,
        ingredients: req.body.ingredients,
        notes: req.body.notes,
        image: {
            image_name: req.file.filename,
            upload_date: Date.now(),
            url: './uploads/menus/item/' + req.file.filename
        },
        prices: [],
        cost: []
    };
    for (let i = 0; i < req.body.ot_name.length; i++){
        item.description.push({name: req.body.ot_name[i], description: req.body.ot_desc[i]})
    }
    Item.create(item, (err, newlyCreated) => {
        if (err) {
            res.send(err)
        } else {
            res.status(200).send({status: 200, message: 'Post succeeded', data: newlyCreated})
        }
    }) 
}

//Post Item

exports.post_item_create = (req, res, next) => {
    
    
    let locations = req.body.locations;
        locations = locations.split(',');
    
    let tags = req.body.tags;
        tags = tags.split(",");
    
    let order_types = req.body.order_types;
        order_types = order_types.split(",");
    
    let ingredients = JSON.parse(req.body.ingredients)
    
    let recipe = ingredients.recipe
        recipe = recipe.map(ingredient => ({id: ingredient.id, name: ingredient.name, amount: parseFloat(ingredient.amount)}))
   
    let prices = JSON.parse(req.body.prices);
        prices = prices.map(price => ({type: price.type, text:price.text, amount: parseFloat(price.amount)}))
    
    let descriptions = JSON.parse(req.body.description);
    
    const item = {
        name: req.body.name,
        category: req.body.category,
        locations: locations,
        order_types: order_types,
        tags: tags,
        ingredients: {
            list: ingredients.list,
            recipe: recipe
        },
        notes: req.body.notes,
        prices: prices,
        description: descriptions,
    };
    
    
    if (req.fileValidationError){
        res.status(415).json({
            status: 415,
            message: req.fileValidationError
        })
    } else if (!req.file) {
       res.status(406).json({
            status: 406,
            message: "Image upload of .jpg or .png required"
        }) 
    } else {
        item.image = {
            image_name: req.file.filename,
            upload_date: Date.now(),
            url: './uploads/menus/item/' + req.file.filename
        },
        Item.create(item, (err, newlyCreated) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(201).json({status: 201, data: newlyCreated});
            }
        })
    }
}
     
//Item Mongoose Map Post Test
exports.post_test_map = (req, res) => {
    const item = {
        name: req.body.name,
        description: [],
        locations: req.body.locations,
        order_types: req.body.order_type,
        tags: req.body.tags,
        ingredients: req.body.ingredients,
        notes: req.body.notes,
        image: {
            image_name: req.file.filename,
            upload_date: Date.now(),
            url: './uploads/menus/item/' + req.file.filename
        },
        prices: [],
        cost: []
    };
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
                console.log('file has been deleted');
            });
             res.status(200).send({status: 200, message: 'Item deleted', data: item});
        }
    });
};


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
                res.status(202).send({status: 202, message: "collection is empty"})
            } else {
                res.json(docs)
            }
        }
    })
}

exports.get_items_all_full = (req, res) => {
    Item.find().
    populate('ingredients.list').
    populate('locations', 'nickname name id').
    exec((err, results) => {
        if (err) console.log(err)
            res.json(results)
    });
}

exports.get_items_by_search = (req, res) => {
    
    Item.find().
    populate('ingredients.list').
    populate('locations').
    exec((err, results) => {
        if (err) {
            console.log(err);
        } else {
                let filtered = [];
                for (var i = 0; i < results.length; i++){
                    for (var j = 0; j < results[i].ingredients.list.length; j++){
                        if (results[i].ingredients.list[j].name == req.params.name){
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

exports.add_item_to_section = (req, res) => {
    let sectionReq = Section.findById(req.params.section_id).exec();
    let itemReq = Item.findById(req.params.item_id).exec();
    
    Promise.all([sectionReq, itemReq])
    .then(([section, item]) => {
        section.items.push(req.params.item_id);
        section.save();
        return section;
    }).then((section) => {
        Section.find({_id: req.params.section_id})
        .populate('items', 'name')
        .exec((err, section) => {
            if (err){
                res.status(500)
            } else {
                res.json(section)
            }
        })
    })
    
}

exports.addItemArrayToSection = (req, res) => {
    let item_array = req.body.items;
    
    Section.findById(req.params.section_id)
    .exec((err, doc) => {
        if (err){
            res.status(500);
        } else {
            if (doc.length === 0){
                res.status(404).send({status: 404, message: 'No menus found'});
            } else {
                console.log(item_array.length)
               
               for (let i=0; i < item_array.length; i++){
                   doc.items.push(item_array[i]);
               }
               doc.save();
               res.json(doc)
            }
        }
    })
}

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

exports.validate_item = (req, res, next) => {
    req.checkBody('name')
        .notEmpty().withMessage('name required')
        .isLength({min: 3}).withMessage('name must by 3+ chars');
    req.checkBody('order_types')
        .custom(val => {
            let array = val.split(',');
            
            let allowedParams = ['dine-in', 'delivery', 'carry-out', 'bar', 'slice-line'];
            let counter = '';
            array.filter(function(item){
                let value = allowedParams.indexOf(item);
                if (value === -1){
                    counter = false;
                }
            });
            let status = function(counter){
                if (counter === false){
                    return false;
               } else {
                   return true;
               }
            }; 
            return status(counter);
        })
        .withMessage('invalid params: only dine-in, delivery, carry-out, bar, or slice-line are valid params');
    req.checkBody('tags')
    req.checkBody('ingredients')
        .notEmpty().withMessage('at least one ingredient is required')
        .custom(val => {
            let ingredients = JSON.parse(val);
            let list = ingredients.list;
            let recipe = ingredients.recipe;
            let results = list.map(loc => loc.match(/^[a-z0-9]+$/i) !== null);
            let counter = '';
            
            if(list.length < 1 || recipe.length < 1){
                counter = false;
                return counter;
            } else if (results.includes(false)){
                counter = false;
                return counter;
            } else {
                let idMatches = recipe.map(loc => list.includes(loc.id) && typeof loc.name === "string" && loc.amount.match(/^-?\d+\.?\d*$/) !== null)
                if (idMatches.includes(false)){
                    counter = false;
                    return counter;
                }
            }
            
            let status = counter => {
                if (counter === false) return false;
                 else return true
            };
            return status(counter);
             
        }).withMessage('invalid params: ingredients list array and ingredient recipe array required. List must alpha numeric and 24 char.')
    req.checkBody('locations')
        .notEmpty().withMessage('at least one location is required')
        .custom(val => {
            let array = val.split(',');
            let counter = '';
            array.filter((item) => {
                if (item.length !== 24){counter = false}
            });
            let status = (counter) => {
                if (counter === false) {return false;
                } else {
                    return true;
                }
            };
            return status(counter);
        }).withMessage('malformed params: location ids must be 24 alphanumeric chars');
    req.checkBody('category')
        .notEmpty().withMessage('category missing')
        .custom(val => {
            
            let allowedParams = ['appetizers', 'salads', 'pasta', 'hoagies',
            'pizza', 'dessert', 'beer', 'cocktails', 'red_wine',
            'white_wine', 'bar', 'happy_hour', 'slices', 'platter'];
            let counter = '';
            
            let value = allowedParams.indexOf(val);
            if (value === -1){
                counter = false;
            }
            let status = (counter) => {
                if (counter === false){
                    return false;
                } else {
                    return true;
                }
            };
            return status(counter);
        }).withMessage('malformed params: category value not allowed');
        req.checkBody('prices')
            .notEmpty().withMessage('Price array is missing');
        if (req.body.prices && req.body.category === 'salads'){
            req.checkBody('prices')
            .notEmpty().withMessage('missing params: salad prices objects required')
            .custom(val => {
                
                let counter = '';
                let p = JSON.parse(val);
                let typeParams = ['sm', 'lg', 'party'];
                let textParams = ['small', 'large', 'party-size'];
                
                for (let i = 0; i < p.length; i++){
                    
                    let typeValue = typeParams.indexOf(p[i].type),
                        textValue = textParams.indexOf(p[i].text);
                        
                    if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p[i].amount.match(/^-?\d+\.?\d*$/) == null){
                        counter = false;
                        return counter;
                    } else if (typeValue !== textValue) {
                         counter = false;
                         return counter;
                    } else {
                         counter = true;
                    }
                }
                let status = (counter) => {
                    if (counter === false){
                        return false;
                    } else {
                        return true;
                    }
                };
                return status(counter);
            }).withMessage('malformed params: price params do not match category')
        } else if (req.body.prices && req.body.category === 'pasta'){
             req.checkBody('prices')
            .notEmpty().withMessage('missing params: pasta prices objects required')
            .custom(val => {
                let counter = '';
                let p = JSON.parse(val);
                let typeParams = ['reg', 'party'];
                let textParams = ['regular', 'party-size'];
                
                for (let i = 0; i < p.length; i++){
                    
                    let typeValue = typeParams.indexOf(p[i].type),
                        textValue = textParams.indexOf(p[i].text);
                        
                    if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p[i].amount.match(/^-?\d+\.?\d*$/) == null){
                        counter = false;
                        return counter;
                    } else if (typeValue !== textValue) {
                         counter = false;
                         return counter;
                    } else {
                         counter = true;
                    }
                }
                let status = (counter) => {
                    if (counter === false){
                        return false;
                    } else {
                        return true;
                    }
                };
                return status(counter);
            }).withMessage('malformed params: price params do not match category')
        } else if (req.body.prices && req.body.category === 'hoagies'){
            req.checkBody('prices')
            .notEmpty().withMessage('missing params: hoagies prices objects required')
            .custom(val => {
                let counter = '';
                let p = JSON.parse(val);
                let typeParams = ['reg', 'vr'];
                let textParams = ['regular','vegan'];
                let tagValue = typeParams.indexOf('vr');
                let tags = req.body.tags.split(',');
                
                if (tags.includes('vr')){
                        for (let i = 0; i < p.length; i++){
                            let typeValue = typeParams.indexOf(p[i].type),
                                textValue = textParams.indexOf(p[i].text);
                                if (typeValue === -1 || textValue === -1 || p.length < 2){
                                    counter = false;
                                    return counter;
                                }
                        }
                    } else {
                        console.log('no vr')
                        if (p.length === 1){
                            if (p[0].type && p[0].text && p[0].amount){
                                if (p[0].type !== "reg" || p[0].text !== "regular" || p[0].amount === null || p[0].amount.match(/^-?\d+\.?\d*$/) == null) {
                                    
                                    counter = false;
                                    return false;
                                } counter = true;
                            } else {
                                counter = false;
                                return false;
                            }
                        } else {
                            counter = false;
                            return false;
                        }
                    }
                
                let status = (counter) => {
                    if (counter === false){
                        return false;
                    } else {
                        return true;
                    }
                };
                return status(counter);
            }).withMessage('malformed params: price params do not match hoagie category')
        } else if (req.body.prices && req.body.category === 'pizza'){
                req.checkBody('prices')
                .notEmpty().withMessage('missing params: pizza prices objects required')
                .custom(val => {
                    let counter = '';
                    let p = JSON.parse(val);
                    let typeParams = ['sm','med','lg','gfr'];
                    let textParams = ['s','m','l','gf'];
                    let tagValue = typeParams.indexOf('gfr');
                    let tags = req.body.tags.split(',');
                    
                    if (tags.includes('gfr')){
                            for (let i = 0; i < p.length; i++){
                                let typeValue = typeParams.indexOf(p[i].type),
                                    textValue = textParams.indexOf(p[i].text);
                                
                                if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p[i].amount.match(/^-?\d+\.?\d*$/) == null){
                                    counter = false;
                                    return counter;
                                } else if (typeValue !== textValue) {
                                     counter = false;
                                     return counter;
                                } 
                            }
                    } else {
                        console.log('no gfr')
                        if (p.length === 3){
                            
                            typeParams.pop(); //remove GFR from array
                            textParams.pop();
                            
                            for (let i = 0; i < p.length; i++){
                                let typeValue = typeParams.indexOf(p[i].type),
                                    textValue = textParams.indexOf(p[i].text);
                                
                                if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p[i].amount.match(/^-?\d+\.?\d*$/) == null){
                                    counter = false;
                                    return counter;
                                } else if (typeValue !== textValue) {
                                     counter = false;
                                     return counter;
                                } 
                            }
                        
                        } else {
                            counter = false;
                            return counter;
                        }
                    }
                    let status = (counter) => {
                        if (counter === false){
                            return false;
                        } else {
                            return true;
                        }
                };
                return status(counter);
                }).withMessage('malformed params: price params do not match pizza category');
        } else if (req.body.prices && req.body.category === 'dessert'){
                req.checkBody('prices')
                .notEmpty().withMessage('missing params: dessert prices objects required')
                .custom(val => {
                    let counter = '';
                    let p = JSON.parse(val);
                    let nameArray = req.body.name.split(' ');
                    let typeParams = ['reg', 'sm-platter', 'lg-platter'];
                    let textParams = ['regular', 'Sm Platter', 'Lg Platter'];
                    
                    if(nameArray.includes('bar') || nameArray.includes('brownie')){
                        for (let i = 0; i < p.length; i++){
                            let typeValue = typeParams.indexOf(p[i].type),
                                textValue = textParams.indexOf(p[i].text);
                                
                                if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p[i].amount.match(/^-?\d+\.?\d*$/) == null){
                                    counter = false;
                                    return counter;
                                } else if (typeValue !== textValue){
                                    counter = false;
                                    return counter;
                                }
                        }
                    } else if (nameArray.includes('platter')){
                        typeParams = ['sm-platter', 'lg-platter'];
                        textParams = ['Platter of 20 bites', 'Platter of 40 bites'];
                        
                        for (let i = 0; i < p.length; i++){
                            let typeValue = typeParams.indexOf(p[i].type),
                                textValue = textParams.indexOf(p[i].text);
                                
                                if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p[i].amount.match(/^-?\d+\.?\d*$/) == null){
                                    counter = false;
                                    return counter;
                                } else if (typeValue !== textValue){
                                    counter = false;
                                    return counter;
                                }
                        }
                    } else {
                        if (p.length !== 1 || p.type !== 'reg' || p.text != 'regular' || !p.amount || p.amount == null || p.amount.match(/^-?\d+\.?\d*$/) == null){
                            counter = false;
                            return counter;
                        }
                    }
                    let status = (counter) => {
                        if (counter === false){
                            return false;
                        } else {
                            return true;
                        }
                    }
                    return status(counter);
                }).withMessage('malformed params: price params do not match dessert category');
        } else if (req.body.prices && req.body.category === 'appetizers'){
                req.checkBody('prices')
                .notEmpty().withMessage('missing params: appetizer prices objects required')
                .custom(val => {
                    let counter = '';
                    let p = JSON.parse(val);
                    let typeParams = ['reg','party','vr','vegan_party','gfr','gf_party'];
                    let textParams = ['regular','party-size','vegan','vegan-party-size','gluten-free','gf-party-size'];
                    let tagValue = typeParams.indexOf('gfr');
                    let tags = req.body.tags.split(',');
                    let diet = ['v','gfr','gf','vr'];
                    if (tags.includes('vr') && tags.includes('gfr')){
                        for (let i = 0; i < p.length; i++){
                            let typeValue = typeParams.indexOf(p[i].type),
                                textValue = textParams.indexOf(p[i].text);
                            
                            if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p[i].amount.match(/^-?\d+\.?\d*$/) == null){
                                    counter = false;
                                    return counter;
                            } else if (typeValue !== textValue) {
                                     counter = false;
                                     return counter;
                            } 
                        }
                    } else if (tags.includes('vr') && !tags.includes('gfr')){
                        let updatedType = typeParams.filter(el => el !== 'gfr' && el !== 'gf_party');
                        let updatedText = textParams.filter(el => el !== 'gluten-free' && el !== 'gf-party-size');
                       
                        for (let i = 0; i < p.length; i++){
                            let typeValue = updatedType.indexOf(p[i].type),
                                textValue = updatedText.indexOf(p[i].text);
                                
                            if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p[i].amount.match(/^-?\d+\.?\d*$/) == null || p.length < updatedType.length){
                                    counter = false;
                                    return counter;
                            } else if (typeValue !== textValue) {
                                    counter = false;
                                    return counter;
                            } 
                        }
                        
                    } else if (tags.includes('gfr') && !tags.includes('vr')){
                        let updatedType = typeParams.filter(el => el !== 'vr' && el !== 'vegan_party');
                        let updatedText = textParams.filter(el => el !== 'vegan' && el !== 'vegan-party-size');
                        console.log(updatedType)
                        for (let i = 0; i < p.length; i++){
                            let typeValue = updatedType.indexOf(p[i].type),
                                textValue = updatedText.indexOf(p[i].text);
                                
                            if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p[i].amount.match(/^-?\d+\.?\d*$/) == null || p.length < updatedType.length){
                                    counter = false;
                                    return counter;
                            } else if (typeValue !== textValue) {
                                    counter = false;
                                    return counter;
                            } 
                        }
                    } else if (!tags.includes('gfr') && !tags.includes('vr')){
                        console.log('!gfr !vr')
                        let updatedType = typeParams.filter(el => el !== 'vr' && el !== 'vegan_party' && el !== 'gfr' && el !== 'gf-party' && el !== 'v' && el !== 'gf_party');
                        let updatedText = textParams.filter(el => el !== 'vegan' && el !== 'vegan-party-size' && el !== 'gluten-free' && 'gf-party-size' && el !== 'vegan' && el !== 'gf-party-size');
                        console.log(updatedType)
                        for (let i = 0; i < p.length; i++){
                            let typeValue = updatedType.indexOf(p[i].type),
                                textValue = updatedText.indexOf(p[i].text);
                                
                            if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p[i].amount.match(/^-?\d+\.?\d*$/) == null || p.length < updatedType.length){
                                    counter = false;
                                    return counter;
                            } else if (typeValue !== textValue) {
                                    counter = false;
                                    return counter;
                            } 
                        }
                    } else{
                        counter = true;
                    }
                    
                    let status = (counter) => {
                        if (counter === false){
                            return false;
                        } else {
                            return true;
                        }
                    }
                    return status(counter);
                }).withMessage('malformed params: price params do not match appetizer category')
                
                
        }
    
    req.checkBody('description')
    .notEmpty().withMessage('missing params: description objects required')
    .custom(val => {
            let desc = JSON.parse(val);
            let orderTypes = req.body.order_types.split(',');
            let counter = '';
            
            let matches = desc.map(d => orderTypes.includes(d.type) && typeof d.type === "string" && typeof d.text === "string" && d.text !== '' && d.text.match(/^[a-zA-Z0-9 "!?.-]+$/)) 
            if (matches.includes(false)){
                counter = false;
                return counter;
            }
 
            let status = counter => {
                if (counter === false) return false;
                 else return true
            };
            return status(counter); 
             
    }).withMessage('malformed params: description params do not match ordertypes')
     
    req.asyncValidationErrors().then(function(){
        next()
    }).catch(function(errors){
        let msg = {
            status: 400,
            errors: errors
        }
        res.status(400).json(msg);
    })
}