const mongoose = require('mongoose');
const Category = require('../models/category');


var Menu_Schema = new mongoose.Schema({
    name: String, 
    nickname: String, 
    description: String,
    categories: [],
    locations: [],
    image: {
        image_name: String, 
        upload_date: {
            type: Date,
            default: Date.now
        },
        url: String
    },
    order_type: String,
    menu_items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu_Item"
        }    
    ]
});

module.exports = mongoose.model("Menu", Menu_Schema);