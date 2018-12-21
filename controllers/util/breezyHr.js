const request = require('request-promise-cache');


let breezyKeys = {};
let breezyPositions = {};

let breezyHrReqs = {
    base: 'https://breezy.hr/public/api/v3',
    sign_in: 'https://breezy.hr/public/api/v3/signin',
    user_details: 'https://breezy.hr/public/api/v3/user/details'
}

exports.getUser = function(){
    return request({
       url: breezyHrReqs.sign_in,
       body: "{\"email\":\"corey@pizzaluce.com\",\"password\":\"Summit123\"}",
       headers: {
           "Content-Type": "application/json"
       },
       method: "POST",
    })
}

exports.getUserId = function(user){
    let result = JSON.parse(user);
    breezyKeys.userId = result.user._id;
    breezyKeys.access_token = result.access_token;
    return result;
}

exports.getUserDetails = function(user){
    return request({
        url: breezyHrReqs.user_details,
        headers: {
            Authorization: user.access_token,
            "Content-Type": "application/json"
        }
    })
}

exports.parseUserDetails = function(userDetailsRes){
    let result = JSON.parse(userDetailsRes)
    breezyKeys.company_id = result[Object.keys(result)[0]];
    breezyKeys.company_id = breezyKeys.company_id.company._id;
    return result;
}

exports.main = function(params){
    return exports.getUser()
    .then(exports.getUserId)
    .then(exports.getUserDetails)
    .then(exports.parseUserDetails)
}

