const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client(GOOGLE_CLIENT_ID, '',  '');

//return a promise with user info
module.exports.getGoogleUser = (code) => {
    //verify token using google client
    return client.verifyIdToken({idToken: code, audience: GOOGLE_CLIENT_ID})
        .then(login => {
            //if verification is ok, google returns a jwt
            let payload = login.getPayload();
            let userid = payload['sub'];
            
            //check if the jwt if issued for client
            let audience = payload.aud;
            if (audience !== GOOGLE_CLIENT_ID) {
                throw new Error( "error while authenticating google user: audience mismatch: wanted [" + GOOGLE_CLIENT_ID + "] but was [" + audience + "]" );
            }
            //promise the creation of user
            return {
                name: payload['name'], //profile name
                pic: payload['picture'], //profile pic
                id: payload['sub'],
                email_verified: payload['email_verified'],
                email: payload['email']
            }
        })
        .then(user => {return user;})
        .catch(err => {
            //throw an error if something goes wrong
                throw new Error( "error while authenticating google user: " + JSON.stringify( err ));
        })
}