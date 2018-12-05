/*
 *
 *
 */
User = function () {
    this.router = require('express').Router();
    this.path = '/u';
    this.service = require('../service/service')

    this.regist = function () {
        this.router.get('/:id', function (req, res) {
            console.log('home.about, id=' + req.params.id)
            res.render('page.html')
        })
    }
}

var user = new User()
module.exports = user

