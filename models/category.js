const mongoose = require('mongoose');

var Categories_Schema = new mongoose.Schema({
    name: String, 
    description: [], 
    image: {
        image_name: String, 
        upload_date: {
            type: Date,
            default: Date.now
        },
        url: String
    }
});

module.exports = mongoose.model('Category', Categories_Schema);