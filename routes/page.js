const express = require('express')
const page = express.Router()

page.get('/:id', function (req, res) {
    console.log('home.about, id=' + req.params.id)
    res.render('page.html')
})

page._path = '/p'
module.exports = page
