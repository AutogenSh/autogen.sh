/*
 *
 *
 */
var publish_service = require('../service/publish_service');
var router = require('express').Router();

var user = (function() {
    
    router.get('/:id', function (req, res) {
        console.log('home.about, id=' + req.params.id)
        res.render('page.html')
    })

    return {
        path: '/u',
        router: router
    }
})();

module.exports = user

