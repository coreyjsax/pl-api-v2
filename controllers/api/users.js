const User = require('../../models/user');

exports.post_user_create = (req, res) => {
    const new_user = {
        name: {
            first: req.body.first_name,
            last: req.body.last_name
        },
        email: req.body.email,
        password: req.body.password
    }
    
    User.create(new_user, (err, newUser) => {
        if (err) {
            res.status(500)
        } res.status(201).json({status: 201, data: newUser})
        
    })
}

exports.get_all_users = (req, res) => {
    User.find({}, (err, docs) => {
        if (err){
            res.status(500)
        } res.json(docs)
    })
}