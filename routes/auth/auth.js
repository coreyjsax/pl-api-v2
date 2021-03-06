const express = require('express');
const router = express.Router();
const googleAuth = require('../../controllers/auth/google');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const authConfig = require('../../controllers/auth/auth-config');
const auth_controller = require('../../controllers/auth/auth');



/* POST login. */
/*router.post('/login', function (req, res, next) {

passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user : user
            });
        }

req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }

// generate a signed son web token with the contents of user object and return it in the response

const token = jwt.sign(user, 'your_jwt_secret');
           return res.json({user, token});
        });
    })(req, res);
});
*/


//router.post('/', auth_controller.log_in_user);

router.get('/login', auth_controller.logInPage);

//router.get('/login/confirm', auth_controller.redirect);

router.post('/gtoken', auth_controller.gToken)

//const jwt = require('./')

//Require auth controller






module.exports = router;