//Menu Models
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const Ingredient = require('../../models/ingredient');
const server_error = {message: 'There was a problem...'};

const tools = require('../../controllers/util/tools');
const fs = require('fs');

// Category Controllers

exports.post_category_create = (req, res) =>  {
    const new_category = {
        name: req.body.name,
        description: req.body.description,
        image: {
            image_name: req.file.filename,
            upload_date: Date.now(),
            url: './uploads/categories/' + req.file.filename
        }
    }
    Category.create(new_category, (err, newlyCreated) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send({status: 200, message: 'Post succeeded', data: newlyCreated})
        }
    })
}

//Get Categories
exports.get_categories = (req, res) => {
    Category.find({}, (err, docs) => {
        if (err) {
            if(!docs){
                res.status(404).send({status: 404, message: 'No categories found'});
            } else {
                res.status(500).send(server_error)
            }
        } else {
            if (docs.length === 0) {
                res.status(404).send({status: 404, message: 'No categories found'});
            } else {
                res.json(docs)
            }
        }
    })
}

//Get Category by ID
exports.get_category_by_id = (req, res) => {
    Category.findById(req.params.id, (err, doc) => {
        if (err) {
            if (!doc){
                 res.status(404).send({status: 404, message: `Category ${req.params.id} not found`});
            } else {
                res.status(500).send(server_error)
            }
        } else {
            if (doc.length === 0) {
                res.status(404).send({status: 404, message: `Category ${req.params.id} not found`});
            } else {
                res.json(doc)
            }
        }
    })
}

//Delete Category
exports.delete_category = (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err, category) => {
        if (err) {
            res.status(404).send({status: 404, message: 'No categories found'});
        } else {
            let image_id = category.image.image_name;
            let image_path = category.image.url;
            fs.unlink('./public/' + image_path, function(err){
                if (err) {
                    console.log(err);
                }
                console.log('file has been deleted')
            })
            res.status(200).send({status: 200, message: 'Category deleted', data: category})
        }
    })
}

//Edit Category
exports.edit_category = (req, res) => {
    const updated_data = {
        name: req.body.name,
        description: req.body.description,
        image: {
            image_name: req.file.filename,
            upload_date: Date.now(),
            url: './uploads/categories/' + req.file.filename
        }
    }
    Category.findById(req.params.id, (err, doc) => {
        if (err) {
            res.status(404).send({status: 404, message: 'No categories found'});
        } else {
            let image_id = doc.image.image_name;
            let image_path = doc.image.url;
            fs.unlink('./public/' + image_path, function(err){
                if (err) {
                   res.send(err)
                }
                console.log('file has been deleted')
            })
            Category.update({_id: req.params.id}, updated_data, (err, raw) => {
                if (err) {
                    res.send(err)
                }
                res.status(200).send({status: 200, message: 'Category updated', data: updated_data})
            })
        }
    })
}