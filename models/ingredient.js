const mongoose = require('mongoose');

var IngredientSchema = new mongoose.Schema({
    name: String, 
    description: String,
    type: [],
    tags: [],
    updated: {
        type: Date, 
        default: Date.now
    },
    cost: Number,
    notes: String,
    meta: {
        color: String
    }
});

module.exports = mongoose.model('Ingredient', IngredientSchema);