const mongoose = require('mongoose');

let PromosSchema = new mongoose.Schema({
    name: String,
    description: String,
    days: [], // Array of objects with days and hours {day: monday, start_time: 11am, end_time: 2pm}
    location_id: String
})

module.exports = mongoose.model("Promos", PromosSchema);