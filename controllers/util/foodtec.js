const request = require('request-promise-cache');
const Locations = require('../../models/location');

exports.ftReqs = {
    base: `https://marketing.foodtecsolutions.com/publicapi/stores/locations?merchant=Pizza%20Luce&`,
    reqs: {
            downtown: `longitude=-93.27&latitude=44.98&radius=1.0`,
            uptown: `longitude=-93.28&latitude=44.94&radius=1.0`,
            duluth: `longitude=-92.100&latitude=46.78&radius=5.0`,
            seward: `longitude=-93.24&latitude=44.96&radius=1.0`,
            stpaul: `longitude=-93.15&latitude=44.94&radius=1.0`,
            hopkins: `longitude=-93.38&latitude=44.92&radius=1.0`,
            richfield: `longitude=-93.28&latitude=44.88&radius=1.0`,
            roseville: `longitude=-93.16&latitude=45.02&radius=1.0`,
            edenprairie: `longitude=-93.34&latitude=45.02&radius=1.0`
            /*'https://marketing.foodtecsolutions.com/publicapi/stores/locations?merchant=Pizza%20Luce&longitude=-93.34&latitude=45.02&radius=5.0&orderType=Delivery' -i */
        },
    headers: {
        "Accept" : "application/json",
        "X-Fts-Api-Token": process.env.FoodTecKey
    },
   storeHeaders: {
        "Accept" : "application/json",
        "Content-Type": "application/json"
    },
    giftHeaders : {
        'Accept': 'application/json;charset=UTF-8',
        'X-FTS-client-token': process.env.FoodTecGiftCardKey,
        'Content-Type': 'application/json;charset=UTF-8',
        'Content-Length': '42'
    }
}

exports.getDeliveryArea = function(store){
    return request({
        url: `https://${store}.pizzaluce.com/ws/store/deliveryAreas`,
        cacheKey: `https://${store}.pizzaluce.com/ws/store/deliveryAreas`,
        cacheTTL: 100000,
        cacheLimit: 1000,
        headers: exports.ftReqs.storeHeaders
    }).then((res) => {
        let deliveryArea = JSON.parse(res);
        let tmp = deliveryArea.areas[0].mapPoints;
        for (var i = 0; i< tmp.length; i++){
            tmp[i].lat = tmp[i].latitude;
            delete tmp[i].latitude;
            tmp[i].lng = tmp[i].longitude;
            delete tmp[i].longitude;
            }
            return tmp;
        }).catch((error) => {
            return error;
        })
}

exports.getDeliveryAreaReqs = function(){
    const stores = ['downtown', 'uptown', 'duluth', 'seward', 'stpaul', 'hopkins', 'richfield', 'roseville', 'edenprairie'];
    let requests = [];
    for (let i = 0; i < stores.length; i++){
        requests.push(
            request({
                url: `https://${stores[i]}.pizzaluce.com/ws/store/deliveryAreas`,
                    cacheKey: `https://${stores[i]}.pizzaluce.com/ws/store/deliveryAreas`,
                    cacheTTL: 100000,
                    cacheLimit: 1000,
                    headers: exports.ftReqs.storeHeaders
            })    
        );
    }
    return requests;
}

exports.getAllDeliveryAreas = (array) => {
    
}

exports.getGiftCardRequests = function(cardNum, pin, query){
    let dataString = `{"cardNumber":"${cardNum}","pin":"${pin}"}`;
    let options = {
            url: `https://gift.foodtecsolutions.com/rest/v2/giftcard/info/${query}`,
            simple: false, 
            method: 'POST',
            headers: exports.ftReqs.giftHeaders,
            body: dataString
    };
    
    function callback(error, response, body){
        if (!error && response.statusCode == 200){
            console.log(body)
        } else {
            console.log(error)
        }
    }
    
    return request(options, callback)
    .then((res) => {
        let data = JSON.parse(res);
        return data;
    }).catch((error) => {
        return error
    });
}

