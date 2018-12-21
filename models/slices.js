const mongoose = require('mongoose');

var Slices_Schema = new mongoose.Schema({
    location_id: String,
    name: String,
    description: String,
    ingredients: [],
    date: {
        type: Date,
        default: Date.now
    },
    price: String,
    type: String,
    tags: [],
    status: String
});

module.exports = mongoose.model('Slice', Slices_Schema);

