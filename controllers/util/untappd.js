const request = require('request-promise-cache');

const tokenR = process.env.untappdReadToken,
      tokenW = process.env.untappdWriteToken,
      username = process.env.untappdUsername,
      authR = "Basic " + new Buffer(username + ":" + tokenR).toString("base64"),
      authW = "Basic " + new Buffer(username + ":" + tokenW).toString("base64"),
      baseUrl = 'https://business.untappd.com/api/v1/';

const headers = {
    'Authorization' : authR
};

exports.getUntappdLocations = () => {
    return request({
        url: baseUrl + 'locations',
        cacheKey: baseUrl + 'locations',
        cacheTTL: 100000,
        cacheLimit: 10000,
        headers: headers
    }).then((res) => {
        let data = JSON.parse(res);
        return data;
    }).catch((error) => {
        return error;
    });
};

exports.getUntappdMenusByLocation = (id) => {
    return request({
        url: `${baseUrl}locations/${id}/menus`,
        headers: headers
    }).then((res) => {
        let data = JSON.parse(res);
        return data;
    }).catch((error) => {
        return error;
    });
};

exports.getUntappdMenuById = (menuId) => {
    return request({
        url: `${baseUrl}menus/${menuId}?full=true`,
        headers: headers
    }).then((res) => {
        let data = JSON.parse(res);
        return data;
    }).catch((error) => {
        return error;
    });
};

 exports.getAllUntappdFullMenusByLocation = (locationId) => {
    let requests = [];
    let menus = [];
    return exports.getUntappdMenusByLocation(locationId)
    .then((menus) => {
        let menuData = menus;
        return menuData;
    }).then((menuData) => {
        for (let i = 0; i < menuData.menus.length; i++){
                var req = {
                    url: `${baseUrl}menus/${menuData.menus[i].id}?full=true`,
                    headers: headers,
                    json: true
                };
                requests.push(request(req));
        }
        return requests;
    }).then((requests) => {
        return Promise.all(requests);
    }).then((args) => {
        return args;
    })
} 