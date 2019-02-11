const request = require('request-promise-cache');


let breezyKeys = {};
let breezyPositions = {};

let breezyHrReqs = {
    base: 'https://api.breezy.hr/v3',
    sign_in: 'https://api.breezy.hr/v3/signin',
    user_details: 'https://api.breezy.hr/v3/user/details',
    company: 'https://api.breezy.hr/v3/company/'
}

exports.getUser = function(){
    return request({
       url: breezyHrReqs.sign_in,
       cacheKey: breezyHrReqs.sign_in,
       cacheTTL: 10000,
       cacheLimit: 50,
       body: `{\"email\":\"${process.env.BreezyUser}\",\"password\":\"${process.env.BreezyPassword}\"}`,
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
        cacheKey: breezyHrReqs.user_details,
        cacheTTL: 10000,
        cacheLimit: 50,
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

exports.getPositions = function(state) {
    return request({
        url: breezyHrReqs.company + breezyKeys.company_id + `/positions${state}`,
        cacheKey: breezyHrReqs.company + breezyKeys.company_id + `/positions${state}`,
        cacheTTL: 10000,
        cacheLimit: 50,
        headers: {
            Authorization: breezyKeys.access_token,
            "Content-Type": "application/json"
        }
    }).then((res) => {
        let data = JSON.parse(res);
        return data;
    })
}

exports.createPosition = function(position) {
    return request({
        url: breezyHrReqs.company + breezyKeys.company_id + `/positions`,
        body: position,
        headers: {
            Authorization: breezyKeys.access_token,
            "Content-Type": "application/json"
        },
        method: "POST"
    }).then((res) => {
        let data = JSON.parse(res);
        return data;
    }).catch((err) => {
        return err;
    });
};

exports.editPosition = function(id, body) {
    return request({
        url: breezyHrReqs.company + breezyKeys.company_id + `/position/${id}/state`,
        body: body,
        headers: {
            Authorization: breezyKeys.access_token,
            "Content-Type": "application/json"
        },
        method: "PUT"
    }).then((res) => {
        let data = JSON.parse(res);
        return data;
    }).catch((err) => {
        return err;
    });
};

exports.main = function(params){
    return exports.getUser()
    .then(exports.getUserId)
    .then(exports.getUserDetails)
    .then(exports.parseUserDetails);
};

exports.main();