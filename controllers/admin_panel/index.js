// API Index Controllers
const tools = require('../../controllers/util/tools');
const ft = require('../../controllers/util/foodtec');
const breezy = require('../../controllers/util/breezyHr');
const request = require('request-promise-cache');
const untappd = require('../../controllers/util/untappd');
//Location Models
const Location = require('../../models/location');
//Menu Models
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const Ingredient = require('../../models/ingredient');
const server_error = {message: 'There was a problem...'};

const error = `
    <div>
        <h2>Sorry! There was an error!</h2>
    </div>
`;

exports.get_admin_index_page = (req, res) => {
    let menuReq = Menu.find()
                 .populate('categories', 'name id')
                 .populate('locations', 'name id nickname').exec();
    let locationReq = Location.find().exec();
    let itemsReq = Item.find().exec();
    let ingredientsReq = Ingredient.find().exec();
    
    Promise.all([menuReq, locationReq, itemsReq, ingredientsReq])
    .then(([menus, locations, items, ingredients]) => {
        let data = {};
        data.menu = menus;
        data.locations = locations;
        data.items = items;
        data.ingredients = ingredients;
        return data;
    }).then((data) => {
        res.render('admin/index', {menus: data.menu, locations: data.locations, 
        items: data.items, ingredients: data.ingredients});
    }).catch((err) => {
        res.render(error)
    });
}

//res.render('admin/index', {menus: docs});

exports.get_menu_gallery = (req, res) => {
    
} 

