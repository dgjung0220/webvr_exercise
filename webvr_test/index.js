var express = require('express')
var app = express()

var route = require('./route.js')

app.use(express.static('img'));
app.use(express.static('node_modules'));

app.locals.pretty = true
app.set('view engine','pug')
app.set('views', './views')

app.use('/', route)

app.listen(3000, function() {
    console.log('listening localhost 3000 port')
})