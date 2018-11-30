const express = require('express')
const home = express.Router()

home.get('/', function (req, res) {
    res.render('index.html')
})

home.get('/about', function about(req, res) {
    res.render('about.html')
})

home._path = ''
module.exports = home
