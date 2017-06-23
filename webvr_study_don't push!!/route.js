var express = require('express')
var router = express.Router()

router.get('/', function(req,res){
    res.render('template');
    //res.render('aframe');
});

router.get('/aframe', function(req,res){
    console.log('aframe');
    res.render('aframe');
});

module.exports = router;