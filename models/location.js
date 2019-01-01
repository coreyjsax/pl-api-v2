const mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    name: String,
    nickname: String,
    address: String,
    city: String,
    zip: String,
    phone: String,
    online_ordering_url: String,
    description: String,
    hours: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hours'
        }
    ],
    promos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Promos'
        }
    ],
    slices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Slices'
        }
    ],
        meta_data: {
            breezy_id: String,
            untappd_id: String,
            foodtec_id: String,
            coordinates: {
                lng: Number,
                lat: Number,
                radius: Number,
                online_ordering_url: String
            },
            menu_boards: {
                untappd: [], //array of menu ids
                pizzaluce: [] //array of menu ids
            }
        },
    image: {
        image_name: String, 
        upload_date: {
            type: Date,
            default: Date.now()
        },
        url: String
    }
})

module.exports = mongoose.model("Location", LocationSchema);