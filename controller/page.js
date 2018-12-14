/*
 *
 *
 */
var publish_service = require('../service/publish_service');
var router = require('express').Router();

var page = (function () {

    router.get('/:id', function (req, res) {
        req.id = req.params.id;
        publish_service.get_menu(req)
            .then(publish_service.get_article_detail)
            .then(publish_service.get_markdown)
            .then(function (req) {
                res.render('page.html', req);
            })
            .catch(function (reason) {
                res.send('<p>' + reason + '</p>');
            });
    })

    return {
        path: '/post',
        router: router
    }
})();

module.exports = page
