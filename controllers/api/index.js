// API Index Controllers
const tools = require('../../controllers/util/tools.js')

//API Root Get Route
exports.get_root = (req, res) => {
    let date = tools.tools.dateTime();
    let welcome = {
        message: 'Welcome to Pizza Lucé API v.2',
        date: date,
        ip: req.ip
    }
    res.json(welcome)
}