// AuthController.js
//var User = require('../user/User');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);
const request = require('request-promise-cache');
const passport = require('passport')
const username = "admin";
const password = '123456';

exports.logInPage = (req, res) => {
    res.render('./auth/log-in_page')
}

exports.redirect = (req, res) => {
    res.render('./auth/redirect')
}

exports.gToken = (req, res) => {
    let tokenCheck = exports.checkToken(req.body.idtoken)
    let user = {}
    tokenCheck.then((data) => {
       let data2 = JSON.parse(data)
       user.name = data2.name;
       user.picture = data2.picture;
       user.email = data2.email;
       return user;
    }).then((user) => {
        res.json(user);
    })
    
   
}

exports.checkToken = function(token){
    return request(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
    .then((res) => {
        return res;
    }).catch((err) => {
        console.log(err)
        return err;
    })
}

/*
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
        });
    } else {
        res.sendStatus(403);
    }
};

exports.confirm = (req, res, next) => {
     passport.authenticate(['jwt'], { session: false }),
  (req, res) => {
    res.send('Secure response from ' + JSON.stringify(req.user));
  }
}
*/