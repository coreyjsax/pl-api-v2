const express = require('express');
const router = express.Router();
const request = require('request-promise-cache');
const multer = require('multer');

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

//Menu Item Image Upload
exports.Storage_Item = multer.diskStorage({
    destination: function(req, file, callback){
         console.log('============')
        console.log(req.params.id)
        callback(null, "./public/uploads/menus/item");
    },
    filename: function(req, file, callback){
        var raw_title = req.body.name + Date.now();
        var raw_title2 = raw_title.toLowerCase();
        var title = raw_title2.replace(/\s/g, '_');
        callback(null, title + '.jpg');
    }
});

exports.upload_item = multer({
    storage: exports.Storage_Item,
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

