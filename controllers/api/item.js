//Menu Models
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const ItemTest = require('../../models/item_test');
const Ingredient = require('../../models/ingredient');
const server_error = {message: 'There was a problem...'};
const {body} = require('express-validator/check');
const tools = require('../../controllers/util/tools');
const fs = require('fs');
////////////////////////
//  Item Controllers  //
////////////////////////

exports.validate_item = (req, res, next) => {
    req.checkBody('name')
        .notEmpty().withMessage('name required')
        .isLength({min: 3}).withMessage('name must by 3+ chars');
    req.checkBody('locations')
        .notEmpty().withMessage('location required');
    req.checkBody('order_types')
        .custom(val => {
            let array = val.split(',');
            
            console.log(array)
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
        .notEmpty().withMessage('at least one tag is required');
    req.checkBody('ingredients')
        .notEmpty().withMessage('at least one ingredient is required')
        .custom(val => {
            let array = val.split(',');
            let counter = '';
            array.filter((item) => {
                if (item.length !== 24){counter = false}
            });
            let status = (counter) => {
                if (counter === false){
                    return false;
                } else {
                    return true;
                }
            };
            return status(counter);
        }).withMessage('malformed params: ingredient ids must be 24 alphanumeric chars');
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
            'pizza', 'desserts', 'beer', 'cocktails', 'red_wine',
            'white_wine', 'bar', 'happy_hour', 'slices', 'platter'];
            console.log(val);
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
                        
                    if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null){
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
                        
                    if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null){
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
                let textParams = ['regular','get_it_vegan'];
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
                                if (p[0].type !== "reg" || p[0].text !== "regular" || p[0].amount === null) {
                                    
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
                                
                                if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null){
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
                            console.log('3')
                            
                            typeParams.pop(); //remove GFR from array
                            textParams.pop();
                            
                            for (let i = 0; i < p.length; i++){
                                let typeValue = typeParams.indexOf(p[i].type),
                                    textValue = textParams.indexOf(p[i].text);
                                
                                if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null){
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
                    if(nameArray.includes('bar') || nameArray.includes('brownie') || nameArray.includes('platter')){
                        
                    }
                    
                }).withMessage('malformed params: price params do not match dessert category');
        } else if (req.body.prices && req.body.category === 'appetizers'){
                req.checkBody('prices')
                .notEmpty().withMessage('missing params: pizza prices objects required')
                .custom(val => {
                    let counter = '';
                    let p = JSON.parse(val);
                    let typeParams = ['reg','party','v','vegan_party','gfr','gf_party'];
                    let textParams = ['regular','party-size','vegan','vegan-party-size','gluten-free','gf-party-size'];
                    let tagValue = typeParams.indexOf('gfr');
                    let tags = req.body.tags.split(',');
                    let diet = ['v','gfr','gf','vr'];
                    if (tags.includes('vr') && tags.includes('gfr')){
                        for (let i = 0; i < p.length; i++){
                            let typeValue = typeParams.indexOf(p[i].type),
                                textValue = textParams.indexOf(p[i].text);
                            
                            if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null){
                                    console.log('-1')
                                    counter = false;
                                    return counter;
                            } else if (typeValue !== textValue) {
                                    console.log('no match')
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
                                
                            if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p.length < updatedType.length){
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
                        
                        for (let i = 0; i < p.length; i++){
                            let typeValue = updatedType.indexOf(p[i].type),
                                textValue = updatedText.indexOf(p[i].text);
                                
                            if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p.length < updatedType.length){
                                    counter = false;
                                    return counter;
                            } else if (typeValue !== textValue) {
                                    counter = false;
                                    return counter;
                            } 
                        }
                    } else if (!tags.includes('gfr') && !tags.includes('vr')){
                        let updatedType = typeParams.filter(el => el !== 'vr' && el !== 'vegan_party' && el !== 'gfr' && el !== 'gf-party');
                        let updatedText = textParams.filter(el => el !== 'vegan' && el !== 'vegan-party-size' && el !== 'gluten-free' && 'gf-party-size');
                        
                        for (let i = 0; i < p.length; i++){
                            let typeValue = updatedType.indexOf(p[i].type),
                                textValue = updatedText.indexOf(p[i].text);
                                
                            if (typeValue === -1 || textValue === -1 || !p[i].amount || p[i].amount === null || p.length < updatedType.length){
                                    counter = false;
                                    return counter;
                            } else if (typeValue !== textValue) {
                                    counter = false;
                                    return counter;
                            } 
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
                }).withMessage('malformed params: price params do not match appetizer category')
        } 
        /* if (req.body.category === 'appetizers'){
            req.checkBody('prices')
            .notEmpty().withMessage('prices cannot be empty')
            .custom(val => {
                let counter = false;
                let prices = JSON.parse(req.body.prices);
                let tags = [req.body.tags]
                
                let type = prices[0].type,
                    text = prices[0].text,
                    amount = prices[0].amount,
                    type2 = prices[1].type,
                    text2 = prices[1].text,
                    amount2 = prices[1].amount; 
                    let tags2 = req.body.tags.split(',')
                    const p = prices; */

                       
            /*    for (let i = 0; i < prices.length; i++){
                
                    if (prices[i].type && prices[i].text && prices[i].amount){
                        if (prices[i].type == 'reg' || prices[i].type == 'party' && prices[i].text == 'regular' || prices[i].text == 'party-size'){
                            if (tags2.length > 0){
                                console.log('passed req, party')
                                for (let j = 0; j < tags2.length; j++){
                                    if (tags2[j] == 'v'){
                                        if (prices[i].type == 'vegan' || prices[i].type == 'vegan_party' && prices[i].text == "get_it_vegan" || prices[i].text == "Vegan Party Size") {
                                            console.log(prices[i].type)
                                            console.log('type, text and amount are good')
                                        } else {
                                            console.log('vegan fail')
                                        }
                                    } else if (tags2[j] == 'gfr'){
                                        if (prices[i].type == 'gfr' || prices[i].type == 'gfr_party' && prices[i].text == "Get it gluten-free" || prices[i].text == "gluten free party size") {
                                            console.log('type, text and amount are good')
                                        } else {
                                            console.log('gf fail')
                                        }    
                                    } else {
                                        console.log('no tags')
                                    }
                                }
                            }
                            
                            
                            
                        } else {
                            console.log('type and text failed')
                        }
                          
                    } else {
                        console.log('something failed')
                    } 
                    
                    
                    
                } */
               
                
           /*  if (!type || type !== "reg" || !text || text !=="Regular" || amount == null || !amount || amount < 0 ){
                    counter = false;
                } else if (!type2 || type2 !== "party" || !text2 || text2 !=="Party Size" || amount2 == null || !amount2 || amount2 < 0 ){
                    counter = false;
                } else  {
                    
                } */
                
           /*     array.filter(function(item){
                let value = allowedParams.indexOf(item);
                if (value === -1){counter = false;}
                }) 
                
                let status = (counter) => {
                    if (counter === false){
                        return false
                    } else {
                        return true
                    }
                }
                return status(counter)
            }).withMessage('malformed params: price array params not for category type')
        } else if (req.body.category === 'salads') {
            req.checkBody('prices')
            .notEmpty().withMessage('prices cannot be empty') */
        
         
    
    req.asyncValidationErrors().then(function(){
        next()
    }).catch(function(errors){
        let msg = {
            status: 400,
            errors: errors
        }
        res.status(400).send(msg);
    })
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
    
    
    let ingredients = req.body.ingredients;
        ingredients = ingredients.split(',')
    let locations = req.body.locations;
        locations = locations.split(',');
    let tags = req.body.tags;
        tags = tags.split(",");
    let order_types = req.body.order_types;
        order_types = order_types.split(",");
    
   let dine_in_description = req.body.dine_in_description;
   let delivery_description = req.body.delivery_description
   let carry_out_description = req.body.carry_out_description
   
   // preserve newlines, etc - use valid JSON
    
    let prices = JSON.parse(req.body.prices);
   
    
    prices = prices.map(price => ({type: price.type, text:price.text, amount: parseFloat(price.amount)}))
    
    const item = {
        name: req.body.name,
        description: [],
        category: req.body.category,
        locations: locations,
        order_types: order_types,
        tags: tags,
        ingredients: ingredients,
        notes: req.body.notes,
        image: {
            image_name: req.file.filename,
            upload_date: Date.now(),
            url: './uploads/menus/item/' + req.file.filename
        },
        prices: prices
    };
    
    
  
    
    
  
    
        Item.create(item, (err, newlyCreated) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.json(newlyCreated);
            }
        })
    
     
    
function processOrderTypes(item){
        let description = [];
        
            
       
            for (let i = 0; i < item.order_types.length; i++) {
            if (item.order_types[i] === "dine-in") {
                description.push({
                    order_type: item.order_types[i],
                    description: dine_in_description
                });
            } else if (item.order_types[i] === "delivery"){
                description.push({
                    order_type: item.order_types[i],
                    description: delivery_description
                });
            } else if (item.order_types[i] === "carry-out"){
                description.push({
                    order_type: item.order_types[i],
                    description: carry_out_description
                });
            } 
        }
        
        
        
    }
 
  /*  function sortPrices(category, tags){
            category = category.toLowerCase()
            console.log(tags)
            switch (category) {
              
                case 'appetizers':
                     
                     if (!req.body.reg || !req.body.party){
                        
                           // return res.status(400).send({status: 400, message: 'incomplete data - missing key'})
                        errorHandler(400, 'incomplete data - missing key')
                     } else {
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
                     }
                     
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
        } */
        
 
    
 // sortPrices(req.body.categunction makeItem(item){
       
   
       
}       
 

 
    
    
    //1. build object
    //2. process ordertype
    //3. process category & pricess
    //4. create item 
    


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

