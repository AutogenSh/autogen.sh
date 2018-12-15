/*
 *
 *
 */
var service = require('../service/public_service');
var router = require('express').Router();

module.exports = (function() {
    
    router.get('/:id', function (req, res) {
        console.log('home.about, id=' + req.params.id)
        res.render('page.html')
    })

    return {
        path: '/u',
        router: router
    }
})();


