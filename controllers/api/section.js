//Menu Models
const mongoose = require('mongoose');
const tools = require('../../controllers/util/tools');
const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const Ingredient = require('../../models/ingredient');
const Section = require('../../models/section');
const server_error = {message: 'There was a problem...'};



const fs = require('fs');

//a section belongs to a menu

//create a menu section
exports.post_section_create = (req, res) => {
    let new_section = {
        menu_id: req.params.menu_id,
        position: req.body.position,
        name: req.body.name,
        description: req.body.description,
        created: Date.now()
    };
    
    Menu.findById(req.params.menu_id, (err, menu) => {
        if (err) {
            res.status(500);
        } else {
            Section.create(new_section, (err, section) => {
                if (err) {
                    res.status(500);
                } else {
                    section.save();
                    menu.sections.push(section);
                    menu.save();
                    res.status(201).json({code: 201, data: section});
                }
            });
        }
    }) ;
};

exports.get_all_sections = (req, res) => {
    Section.find().
    exec((err, docs) => {
        if (err) {
            if(!docs){
                res.status(404).send({status: 404, message: 'No menus found'});
            } else {
                res.status(500).send(server_error);
            }
        } else {
            if (docs.length === 0){
                res.status(404).send({status: 404, message: 'No menus found'});
            } else {
                res.json(docs);
            }
        }
    });
};

exports.get_all_sections_full = (req, res) => {
    Section.find().
    populate('items').
    exec((err, docs) => {
        if (err) {
            if(!docs){
                res.status(404).send({status: 404, message: 'No menus found'});
            } else {
                res.status(500).send(server_error);
            }
        } else {
            if (docs.length === 0){
                res.status(404).send({status: 404, message: 'No menus found'});
            } else {
                res.json(docs);
            }
        }
    });
};

exports.get_sections_by_menu = (req, res) => {
    Section.find({menu_id: req.params.menu_id})
    .populate('items')
    .exec((err, sections) => {
        if (err) {
            res.status(500)
        } else {
            res.json(sections)
        }
    })
}

exports.addSectionToMenu = (req, res) => {
    let menuReq = Menu.findById(req.params.menu_id).exec();
    let sectionReq = Section.findById(req.params.section_id).exec();
    
    Promise.all([menuReq, sectionReq])
    .then(([menu, section]) => {
        menu.sections.push(req.params.section_id);
        menu.save();
        return menu;
    }).then((menu) => {
        Menu.find({_id: req.params.section_id})
        .populate('sections', 'name')
        .exec((err, menu) => {
            if (err){
                res.status(500);
            } else {
                res.json(menu);
            }
        })
    })
}

exports.addItemsToSection = (req, res) => {
    let query = req.query;
    let sectionId = req.params.section_id;
    console.log(sectionId)
    let filteredDocs = tools.docIdsByQuery(query);
    let section = Section.findById(sectionId).exec();
    
    Promise.all([filteredDocs, section])
    .then(([docs, section]) => {
        console.log(docs)
        for (let i = 0; i < docs.length; i++){
            section.items.push(docs[i]);
        }
        section.save();
        return section;
    }).then((section) => {
        res.json(section);
    })
}


//https://stackoverflow.com/questions/47701918/get-by-id-in-mongoose