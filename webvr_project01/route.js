var express = require('express')
var router = express.Router()

router.get('/', function(req,res){
    console.log('TEST')
    res.render('template')
})

module.exports = router