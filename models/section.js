const mongoose = require('mongoose');

var Section_Schema = new mongoose.Schema({
    menu_id: String,
    position: Number,
    name: String, 
    description: String,
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    created: Date, 
    updated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Section", Section_Schema);