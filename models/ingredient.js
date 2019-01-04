const mongoose = require('mongoose');

var IngredientSchema = new mongoose.Schema({
    name: {type:String, lowercase: true},
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
        color: {type: String, lowercase: true}
    }
});

module.exports = mongoose.model('Ingredient', IngredientSchema);