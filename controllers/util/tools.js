const express = require('express');
const router = express.Router();
const request = require('request-promise-cache');
const multer = require('multer');
const fileType = require('file-type');
const fs = require('fs');
const agp = require('api-query-params');
const mongoose = require('mongoose');

const Menu = require('../../models/menu');
const Category = require('../../models/category');
const Menu_Item = require('../../models/menu_item');
const Item = require('../../models/item');
const Ingredient = require('../../models/ingredient');
const Section = require('../../models/section');

exports.tools = {
    dateTime: function(){
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth();
        let yyyy = today.getFullYear();
        
        if(dd < 10) {
            dd = '0'+dd
        }
        if (mm < 10) {
            mm = '0'+ mm
        }
        today = mm + '/' + dd + '/' + yyyy;
        return today;
    },
    removeDuplicates: function(array){
        return array.filter((item, index) => {
            return array.indexOf(item) >= index;
        });
    }
}

exports.isAlphaNum = string => {
    return string.match(/^[a-z0-9]+$/i) !== null;
}

//Menu Item Image Upload
exports.Storage_Item = multer.diskStorage({
    destination: function(req, file, callback, err){
        callback(null, './public/uploads/menus/item')
    },
    filename: function(req, file, callback){
        var raw_title = req.body.name + Date.now();
        var raw_title2 = raw_title.toLowerCase();
        var title = raw_title2.replace(/\s/g, '_');
        callback(null, title + '.png');
    }
});

const accepted_extensions = ['png'];
const maxSize = 1 * 7000 * 7000;


exports.upload_item = multer({
 
   
    storage: exports.Storage_Item,
    limits: {
        fileSize: maxSize
    },
    fileFilter: function(req, file, cb){
        
        if (!file) {
            req.fileValidationError = 'file upload required'
            return cb(null, false, new Error('file missing'))
        }else if (file.mimetype !== 'image/png'){
            req.fileValidationError = 'incorrect mimetype';
            return cb(null, false, new Error('wrong file type'))
        }
        cb(null, true)
    }
   
}); //Field name and max count



//Menu Category Image Upload
exports.Storage_Category = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, "./public/uploads/categories");
    }, filename: function(req, file, callback){
       
        var raw_title = req.body.name;
        var raw_title2 = raw_title.toLowerCase();
        var title = raw_title = raw_title2.replace(/\s/g, '_');
        callback(null, title + '.jpg');
    }
})

exports.upload_category = multer({
    storage: exports.Storage_Category,
}); 


//// Menu Models Functions ////
exports.docIdsByQuery = function(query){
    let promise = Item.find(query).select('_id').exec();
    return promise.then((docs) => {
        let array = docs.map(doc => {
            return doc._id;
        });
        return array;
    }).catch((err) => {
        return err;
    });
}