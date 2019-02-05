const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String, required: true, index: {
            unique: true
        }
    },
    phone: String, 
    role: String, 
    password: {
        type: String, required: true
    },
    avatar: String, 
    tags: []
});

// hash user password before saving into database
UserSchema.pre('save', function(next){
this.password = bcrypt.hashSync(this.password, saltRounds);
next();
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);