const express = require('express')
const user = express.Router()

user.get('/:id', function (req, res) {
    console.log('home.about, id=' + req.params.id)
    res.render('page.html')
})

user._path = '/u'
module.exports = user
