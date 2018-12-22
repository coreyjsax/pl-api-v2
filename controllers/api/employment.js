const breezy = require('../../controllers/util/breezyHr');

exports.test = (req, res) => {
    return breezy.main()
    .then((data) => {
         res.json(data)
    })
}

//Get all positions or filter by state
exports.get_all_positions = (req, res) => {
    let state;
    if (req.params.state) {
        if (req.params.state === 'draft' || 'archived' || 'published' || 'closed' || 'pending'){
            state = `?state=${req.params.state}`;
        } 
    } else {
        state = '';
    }
    return breezy.getPositions(state)
    .then((data) => {
         res.json(data)
    })
}

//Get all positions by location or filter by state and location (requisition id)
exports.get_positions_by_loc = (req, res) => {
    let state;
    if (req.params.state) {
        if (req.params.state === 'draft' || 'archived' || 'published' || 'closed' || 'pending'){
            state = `?state=${req.params.state}`;
        } 
    } else {
        state = '';
    }
    return breezy.getPositions(state)
    .then((data) => {
        let location = req.params.location;
        location = location.toUpperCase();
        let filtered = data.filter(function(el){
            return el.requisition_id === location;
        });
        return filtered;
    }).then((filtered) => {
        res.json(filtered)
    })
}

exports.get_positions_categories = (req, res) => {
    let state = '';
    return breezy.getPositions(state)
    .then((data) => {
        let list = [];
        const categories = data.map((data) => {
            return data.department;
        });
        function countInArray(array, value){
            let count = 0;
            for (let i = 0; i < array.length; i++){
                if (array[i] === value) {
                    count++;
                }
            }
            return count;
        }
        let final_categories = categories.unique();
        list.push({
            department: "All",
            jobs: categories.length
        })
        for (let i = 0; i < final_categories.length; i++){
            list.push({
                department: final_categories[i],
                jobs: countInArray(categories, final_categories[i])
            })
        }
        return list;
    }).then((list) => {
        res.json(list)
    })
}
