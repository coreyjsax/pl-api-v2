const mongoose = require('mongoose');

var Menu_ItemSchema = new mongoose.Schema({
    name: String,
    menu_id: String, 
    description: String,
    item_id: String,
    image: {
        image_name: String,
        upload_date: {
            type: Date,
            default: Date.now
        },
        url: String
    },
    category: {
        type: String, 
        lowercase: true
    },
    tags: [],
   
    updated: {
        type: Date,
        default: Date.now
    },
    price: []
});

module.exports = mongoose.model("Menu_Item", Menu_ItemSchema);