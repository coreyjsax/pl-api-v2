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

// Get all positions by location processor
exports.get_location_positions = (locId) => {
    let state = '?state=published';
    return breezy.getPositions(state)
    .then((data) => {
        let location = locId;
        location = location.toUpperCase();
        let filtered = data.filter((el) => {
            return el.requisition_id === location;
        });
        return filtered;
    }).catch((error) => {
        return error;
    });
};


//Get position categories and count
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

//Get Positions by Category
exports.get_positions_by_category = (req, res) => {
    let state = '';
    return breezy.getPositions(state)
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            data[i].description.replace(/<\/?[^>]+>/gi, '')
            console.log(data[i].description)
        }
        if (req.params.department_id != "All") {
            const department = req.params.department_id;
            let filtered = data.filter(function(el){
                return el.department == department;
            });
            let count = filtered.length;
            let object = {
                count: count,
                jobs: filtered
            }
            return object;
        } else {
            let object = {
                count: data.length,
                jobs: data
            }
            return object
        }
    }).then((object) => {
        res.json(object)
    })
}

//post position
exports.postNewPosition = (req, res) => {
    return breezy.createPosition(JSON.stringify(req.body))
    .then((position) => { 
        res.json(position)
    })
}

//update position state
exports.editPositionState = (req, res) => {
    let id = req.params.pos_id;
    let state = {
        state: req.params.state
    }
    return breezy.editPosition(id, JSON.stringify(state))
    .then((position) => {
        res.json(position)
    })
}

Array.prototype.unique = function(){
    return this.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    })
}