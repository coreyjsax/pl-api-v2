const request = require('request-promise-cache');
const ft = require('../../controllers/util/foodtec');

exports.get_one_area = (req, res) => {
    Promise.all([ft.getDeliveryArea(req.params.store)])
    .then((data) => {
        console.log(data)
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