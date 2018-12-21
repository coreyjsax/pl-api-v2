const request = require('request-promise-cache');

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
        "X-Fts-Api-Token": '4tl6n5u9h6mg8q3hrf3oqum3l9'
    },
   storeHeaders: {
        "Accept" : "application/json",
        "Content-Type": "application/json"
    },
}

exports.getDeliveryArea = function(store){
    return request({
        url: `https://${store}.pizzaluce.com/ws/store/deliveryAreas`,
        cacheKey: `https://${store}.pizzaluce.com/ws/store/deliveryAreas`,
        cacheTTL: 10000,
        cacheLimit: 100,
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
            console.log(tmp)
            return tmp;
        }).catch((error) => {
            return error;
        })
}