/*
 *
 *
 */
var service = require('../service/public_service');
var router = require('express').Router();

module.exports = (function () {

    router.get('/:id', function (req, res, next) {
        req.id = req.params.id;
        service.get_menu(req)
            .then(service.get_article_detail)
            .then(service.get_markdown)
            .then(req => res.render('page.html', req))
            .catch(reason => next(reason));
    });

    return {
        path: '/post',
        router: router
    };
})();
