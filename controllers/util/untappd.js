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
const headers_w = {
    'Authorization' : authW
};
console.log(authW)

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
        cacheKey: `${baseUrl}locations/${id}/menus`,
        cacheTTL: 10000,
        cacheLimit: 10000,
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

exports.getCustomMenuById = (menuId) => {
    return request({
        url: `${baseUrl}custom_menus/${menuId}?full=true`,
        headers: headers
    }).then((res) => {
        let data = JSON.parse(res);
        return data;
    }).catch((error) => {
        return error;
    })
}

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
                cacheKey: `${baseUrl}menus/${menuData.menus[i].id}?full=true`,
                cacheTTL: 100000,
                cacheLimit: 100,
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
//Custom Menus
exports.getCustomMenusByLocation = (id) => {
     return request({
        url: `${baseUrl}locations/${id}/custom_menus`,
        headers: headers
    }).then((res) => {
        let data = JSON.parse(res);
        return data;
    }).catch((error) => {
        return error;
    });
}

exports.getAllCustomMenusByLocation = (locationId) => {
    let requests = [];
    let menus = [];
    return exports.getCustomMenusByLocation(locationId)
    .then((menus) => {
        let menuData = menus;
        return menuData;
    }).then((menuData) => {
        for (let i = menuData.custom_menus.length; i--;){
            let req = {
                url: `${baseUrl}custom_menus/${menuData.custom_menus[i].id}?full=true`,
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
    });
}

//Post a new menu object to Untappd

exports.post_new_menu = (locId, data) => {
   return request({
       url: `${baseUrl}locations/${locId}/menus`,
       body: data,
       headers: headers_w,
       json: true,
       method: "POST"
   }).then((res) => {
       return res
   }).catch((err) => {
       return err;
   })
}

//Edit an Untappd Menu

exports.edit_untappd_menu = (untappd_id, menu_id, menu) => {
    console.log(untappd_id)
    console.log(menu_id)
    console.log(menu)
    
    return request({
       url: `${baseUrl}/menus/${menu_id}`,
       body: menu,
       headers: headers_w,
       json: true,
       method: "PUT"
   }).then((res) => {
       return res
   }).catch((err) => {
       return err;
   })
}

//Add sections to Untappd Menu

exports.post_new_untappd_section = (menu_id, section) => {
    return request({
        url: `${baseUrl}/menus/${menu_id}/sections`,
        body: section,
        headers: headers_w,
        json: true,
        method: "POST"
    }).then((res) => {
        return res
    }).catch((err) => {
        return err;
    })
}

//Untappd Search for an Item

exports.get_search_untappd_item = (query) => {
    return request({
        url: `${baseUrl}/items/search/?${query}`,
        headers: headers,
    }).then((res) => {
        let data = JSON.parse(res);
        return data;
    }).catch((err) => {
        return err;
    })
}


//Untapppd Add and Item
exports.post_untappd_item = (section_id, body) => {
    return request({
        url: `${baseUrl}/sections/${section_id}/items`,
        headers: headers_w,
        json: true,
        method: 'POST'
    }).then((res) => {
        return res
    }).catch((err) => {
        return err
    })
}