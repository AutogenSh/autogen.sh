/*
 *
 *
 */
var service = require('../service/public_service');
var router = require('express').Router();

module.exports = (function () {

    router.get('/:id', function (req, res, next) {
        req.id = req.params.id;
        service.getMenu(req)
            .then(service.getArticleDetail)
            .then(service.getMarkDown)
            .then(req => res.render('post.html', req))
            .catch(reason => next(reason));
    });

    return {
        path: '/post',
        router: router
    };
})();
