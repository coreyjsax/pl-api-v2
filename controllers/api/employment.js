const breezy = require('../../controllers/util/breezyHr');

exports.test = (req, res) => {
    return breezy.main()
    .then((data) => {
         res.json(data)
    })
   
}