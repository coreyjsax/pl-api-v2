const request = require('request-promise-cache');
const ft = require('../../controllers/util/foodtec');
const Location = require('../../models/location');


exports.get_one_area = (req, res) => {
    Promise.all([ft.getDeliveryArea(req.params.store)])
    .then((data) => {
        return data;
    }).then((data)=> {
        let store = req.params.store;
        let color = req.params.color
        let location = {
            name: store,
            coords: '',
            area: data,
            color: color
        }
        //Switch for coords
        switch(store) {
            
            case 'downtown': 
                location.coords = {lat: 44.98, lng: -93.27}
                break;
            case 'uptown': 
                location.coords = {lat: 44.94, lng: -93.28}
                break;
            case 'duluth':
                location.coords = {lat: 46.78, lng: -92.100}
                break;
            case 'seward':
                location.coords = {lat: 44.96, lng: -93.23}
                break;
            case 'stpaul': 
                location.coords = {lat: 44.94, lng: -93.15}
                break;
            case 'hopkins':
                location.coords = {lat: 44.92, lng: -93.38
                }
                break;
            case 'richfield':
                location.coords = {lat: 44.88, lng: -93.28}
                break;
            case 'roseville':
                location.coords = {lat: 45.02, lng: -93.16}
                break;
            case 'edenprairie':
                location.coords = {lat: 44.861570, lng: -93.420260}
                break;
            default: 
                location.coords = {lat: 44.98, lng: -93.27}
        }
        res.json(location)
    })
}


exports.get_all_areas = (req, res) => {
    let requests = ft.getDeliveryAreaReqs();
    
    Promise.all([requests[0], requests[1], requests[2], requests[3], requests[4], requests[5], requests[6], requests[7], requests[8]])
    .then(([dtRes, upRes, dulRes, sewRes, stpRes, hopRes, ricRes, rosRes, epRes]) => {
        var tmp = {
            downtown: JSON.parse(dtRes), uptown: JSON.parse(upRes),duluth: JSON.parse(dulRes),
            seward: JSON.parse(sewRes),stpaul: JSON.parse(stpRes),hopkins: JSON.parse(hopRes),
            richfield: JSON.parse(ricRes), roseville: JSON.parse(rosRes), edenprairie: JSON.parse(epRes)
        };
        var area = {
            downtown: tmp.downtown.areas, uptown: tmp.uptown.areas, duluth: tmp.duluth.areas, seward: tmp.seward.areas,
            stpaul: tmp.stpaul.areas, hopkins: tmp.hopkins.areas, richfield: tmp.richfield.areas, roseville: tmp.roseville.areas, edenprairie: tmp.edenprairie.areas
        };
        
        Object.keys(area).forEach(key => {
            for (var i = 0; i < area[key][0].mapPoints.length; i++){
                area[key][0].mapPoints[i].lat = area[key][0].mapPoints[i].latitude;
                delete area[key][0].mapPoints[i].latitude;
                area[key][0].mapPoints[i].lng = area[key][0].mapPoints[i].longitude;
                delete area[key][0].mapPoints[i].longitude;
            }
        })
        
        return area;
    }).then((area) => {
        let location_coords = {
            downtown: {lat: 44.98175089999999, lng: -93.27355019999999},
            uptown: {lat: 44.944511, lng: -93.288742},
            duluth: {lat: 46.787147, lng: -92.098209},
            seward: {lat: 44.962987, lng: -93.240445},
            stpaul: {lat: 44.946900, lng: -93.150235},
            hopkins: {lat: 44.928486, lng: -93.386013},
            richfield: {lat: 44.883469,  lng: -93.289926},
            roseville: {lat: 45.026715, lng: -93.167275},
            edenprairie: {lat: 44.92, lng: -93.34}
        }
        let data = {
            downtown: {
                coordinates: location_coords.downtown,
                delivery_area: area.downtown[0].mapPoints
            },
            uptown: {
                coordinates: location_coords.uptown,
                delivery_area: area.uptown[0].mapPoints
            },
            duluth: {
                coordinates: location_coords.duluth,
                delivery_area: area.duluth[0].mapPoints
            },
            seward: {
                coordinates: location_coords.seward,
                delivery_area: area.seward[0].mapPoints
            },
            stpaul: {
                coordinates: location_coords.stpaul,
                delivery_area: area.stpaul[0].mapPoints
            },
            hopkins: {
                coordinates: location_coords.hopkins,
                delivery_area: area.hopkins[0].mapPoints
            },
            richfield: {
                coordinates: location_coords.richfield,
                delivery_area: area.richfield[0].mapPoints
            },
            roseville: {
                coordinates: location_coords.roseville,
                delivery_area: area.roseville[0].mapPoints
            },
            edenprairie: {
                coordinates: location_coords.edenprairie,
                delivery_area: area.edenprairie[0].mapPoints
            }
        }
        return data;
    }).then((data) => {
        res.json(data)
    })
}
//refactored get all areas requests
exports.get_all_areas_processor = (req, res) => {
    let requests = [];
    const headers = {
        "Accept" : "application/json",
        "X-Fts-Api-Token": process.env.FoodTecKey
    };
    Location.find({}, (err, docs) => {
        let location_names = [];
        for (let i = 0; i < docs.length; i++){
            location_names.push(docs[i].meta_data.foodtec_id)
        }
        return location_names; 
    }).then((location_names) => {
        let data = {
            location_names: location_names,
            requests: []
        }
        for (let j = 0; j < location_names.length; j++){
            let req = {
                url: `https://${location_names[j].meta_data.foodtec_id}.pizzaluce.com/ws/store/deliveryAreas`,
                cacheKey: `https://${location_names[j].meta_data.foodtec_id}.pizzaluce.com/ws/store/deliveryAreas`,
                cacheTTL: 100000,
                cacheLimit: 1000,
                headers: headers,
                json: true
            };
            data.requests.push(request(req));
        }
        return data;
    }).then((data) => {
        return Promise.all(data.requests);
    }).then((args) => {
        
        //return args;
        res.json(args)
    }) 
}

