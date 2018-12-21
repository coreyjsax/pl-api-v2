const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String, 
    phone: String, 
    role: String, 
    username: String, 
    password: String, 
    avatar: String, 
    tags: []
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);