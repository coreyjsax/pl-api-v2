// API Index Controllers
const tools = require('../../controllers/util/tools');
const ft = require('../../controllers/util/foodtec');
//API Root Get Route
exports.get_root = (req, res) => {
    let date = tools.tools.dateTime();
    let welcome = {
        message: 'Welcome to Pizza Lucé API v.2',
        date: date,
        ip: req.ip
    }
    res.json(welcome);
}

//Get Gift Card Data
exports.get_giftcard_data = (req, res) => {

   const cardNumber = req.params.card,
          pin = req.params.pin,
          query = req.params.query;
          
    let giftCardData = {}
    
    let card_data = ft.getGiftCardRequests(req.params.card, req.params.pin, req.params.query)
    .then((data) => {
        console.log(data)
        return data;
    }).then((data) => {
        
        if (query === 'balance' && data.meta.code === 200){
           
            giftCardData.cardNumber = cardNumber;
            giftCardData.cardBalance = data.response;
            return giftCardData;
            
        } else if (query === 'history'){
            
            giftCardData.cardNumber = cardNumber;
            giftCardData.cardBalance = data.response.history[0].amount.price;
            giftCardData.history = data.response.history;
            return giftCardData;
            
        } else {
            giftCardData = {
                code: 404,
                error: 'unknown request'
            }
            return giftCardData;
        }
    }).then((giftCardData) => {
        res.json(giftCardData)
    }) 
}