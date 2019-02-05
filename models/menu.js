const mongoose = require('mongoose');
const Category = require('../models/category');


var Menu_Schema = new mongoose.Schema({
    name: String, 
    nickname: String, 
    description: String,
    locations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location"
        }
    ],
    order_type: String,
    sections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ],
    created: Date,
    updated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Menu", Menu_Schema);