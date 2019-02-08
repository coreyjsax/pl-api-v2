//Menu Models
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const Ingredient = require('../../models/ingredient');
const server_error = {message: 'There was a problem...'};
const agp = require('api-query-params');

////////////////////////////////////
//  Admin Panel Menu Controllers  //
////////////////////////////////////

//Get all Menus (card view)
exports.get_menus = (req, res) => {
    let model = 'menu';
    Menu.find().
    exec((err, docs) => {
        if (err) {
            res.send(err)
        }
            res.render('./admin/loaders/menu-cards', {items: docs, model: model})
    })
};

exports.get_items_search_test = (req, res) => {
    const {filter, skip, sort, projection } = agp(req.query);
    let model=req.params.model
    if (model === "item") {
        Item.find(filter)
        .populate('ingredients.list')
        .sort(sort)
        .exec((err, docs) => {
            if (err) {
                res.send(err)
            }
                res.render('./admin/loaders/menu-cards', {items: docs, model: model})
        })
    } else if (model === "menu") {
        Menu.find(filter)
        .sort(sort)
        .exec((err, docs) => {
            if (err) {
                res.send(err)
            }
                res.render('./admin/loaders/menu-cards', {items: docs, model: model})
        })
    } else if (model === "category") {
        Category.find(filter)
        .sort(sort)
        .exec((err, docs) => {
            if (err) {
                res.send(err)
            }
                res.render('./admin/loaders/menu-cards', {items: docs, model: model})
        })
    } else if (model === "ingredient") {
        Ingredient.find(filter)
        .sort(sort)
        .exec((err, docs) => {
            if (err) {
                res.send(err)
            }
                res.render('./admin/loaders/menu-cards', {items: docs, model: model})
        })
    }
    
}
//ingredients.recipe.name=breaded+mock+chicken&tags=vr

//Get all items (card view)
exports.get_items = (req, res) => {
    let model = 'item';
    Item.find().
    exec((err, docs) => {
        if (err) {
            res.send(err)
        }
            res.render('./admin/loaders/menu-cards', {items: docs, model: model})
    })
}

//Get all categories (card view)
exports.get_categories = (req, res) => {
    let model = 'category'
    Category.find().
    exec((err, docs) => {
        if (err) {
            res.send(err)
        }
            res.render('./admin/loaders/menu-cards', {items: docs, model: model})
    })
}

//Get all ingredients (card view)
exports.get_ingredients = (req, res) => {
    let model = 'ingredient';
    Ingredient.find().
    exec((err, docs) => {
        if (err) {
            res.send(err)
        }
            res.render('./admin/loaders/menu-cards', {items: docs, model: model})
    })
}