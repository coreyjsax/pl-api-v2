const jwt = require('../../controllers/auth/jwt');
const googleAuth = require('../../controllers/auth/google');

const createToken = user => {
    return jwt.generateToken(user);
};

const getUser = login => {
    const type = login.type;
    switch (type) {
        case 'google':
            return googleAuth
                .getGoogleUser(login.code)
                .then(response => {
                    const content = {
                        token: createToken(response),
                        user: response
                    };
                    return content;
                })
                .catch(e => {
                    console.log(e);
                    throw new Error(e);
                });
            break;
        default:
            throw new Error('unknown token type [' + type + ']');
    }
};

const getProtectedResource = (req, authConfig) => {
    const config = authConfig.config;
    let protectedPaths = config.protect;
    let protectedPath = protectedPaths.filter(resource => 
        req.url.startsWith(resource.path)
    );
    if (protectedPath.length == 0) {
        return false;
    }
    if (protectedPath[0].methods.indexOf(req.method) > -1) {
        return true;
    }
    return false;
};

const checkToken = req => {
    let authorization = req.get('authorization');
    if (!authorization) {
        throw new Error (401);
    }
    let token = authorization.replace('Bearer ', '');
    return jwt.verify(token)
};

class Authentication {
    constructor(config){
        this.config = config;
    }
    
    filter(){
        return (req, res, next) => {
            try {
                let shouldProtect = getProtectedResource(req, this.config.routes);
                
                if (shouldProtect){
                    let principal = checkToken(req);
                    res.locals.principal = principal;
                }
                next();
            } catch (e) {
                console.log('unauthorized', e);
                res.status(401).json({error: 'not_authorized'}).end();
            }
        };
    }
    
    authenticate(login){
        return getUser(login).then(principal => {
            
        });
    }
}

module.exports = Authentication;