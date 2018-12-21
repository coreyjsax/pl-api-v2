const mongoose = require('mongoose');

let HoursSchema = new mongoose.Schema({
    name: String,
    desxcription: String, 
    days: [],
    begin: String,
    end: String,
    location_id: String
})

module.exports = mongoose.model("Hours", HoursSchema);