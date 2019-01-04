const mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    name: String,
    locations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Location'}],
    order_types: [],
    description: [],
    tags: [],
    ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],
    notes: String,
    image: {
        image_name: String, 
        upload_date: {
            type: Date, 
            default: Date.now
        },
        url: String
    }
});

module.exports = mongoose.model("Item", ItemSchema);