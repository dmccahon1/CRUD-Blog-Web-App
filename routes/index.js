var express = require('express')
var app = express()

app.get('/', function(req, res) {
    //Redirect to /blog
    res.redirect('/blog');
})

module.exports = app;
