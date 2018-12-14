/*
 *
 *
 */
var publish_service = require('../service/publish_service');
var router = require('express').Router();

module.exports = (function () {

    router.get('/:id', function (req, res, next) {
        req.id = req.params.id;
        publish_service.get_menu(req)
            .then(publish_service.get_article_detail)
            .then(publish_service.get_markdown)
            .then(req => res.render('page.html', req))
            .catch(reason => next(reason));
    });

    return {
        path: '/post',
        router: router
    };
})();
