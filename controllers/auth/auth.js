// AuthController.js
//var User = require('../user/User');
const jwt = require('jsonwebtoken');

const username = "admin";
const password = '123456';

exports.log_in_user = (req, res, next) => {
    let p_username = req.body.username;
    let p_password = req.body.password;
    
    if (p_username == username && p_password == password){
        let token = jwt.sign(
            {username: username},
            'secretKey',
            (err, token) => {
                res.send({
                    ok: true, 
                    message: "log-in successfull",
                    token: token
                })
            })
       
    } else {
        res.send({
            ok: false,
            message: 'Username or password incorrect'
        })
    }
}

exports.ensureToken = (req, res, next) => {
    let bearerHeader = req.headers["authorization"]
    
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
        jwt.verify(bearerToken, 'secretKey', (err, result) => {
            if(err) {res.sendStatus(403)}
            else {next()}
        })
    } else {
        res.sendStatus(403)
    }
}