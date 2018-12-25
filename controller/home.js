/*
 *
 *
 */
var service = require('../service/public_service');
var convert = require('../util/convert');
var router = require('express').Router();

module.exports = (function () {
    router.get('/search', function(req, res) {
        req.tag = req.query.tag.trim();
        service.searchArticle(req)
            .then(function(req) {
                res.json(req.data);
            })
            .catch(function(reason){
                res.send('<p>' + reason + '</p>');
            });
    });

    router.get('/', function (req, res) {
        service.getMenu(req)
            .then(service.getPublishArticleCount)
            .then(service.getPublishArticleList)
            .then(function (req) {
                res.render('index.html', req);
            })
            .catch(function (reason) {
                res.send('<p>' + reason + '</p>');
            });
    });

    router.get('/tag/:tag', function (req, res) {
        req.page = convert.int(req.params.page, 1);
        req.limit = convert.int(req.params.limit, 10);
        req.tag = req.params.tag.trim();
        service.getMenu(req)
            .then(service.searchArticle)
            .then(function (req) {
                req.total = req.data.total;
                req.articles = [];
                req.data.matches.forEach(function (value, index) {
                    var article = {};
                    article.id = value.attrs.article_id;
                    article.title = value.attrs.title;
                    article.summary = value.attrs.summary;
                    article.create_at = value.attrs.create_at;
                    req.articles.push(article);
                });
                res.render('index.html', req);
            })
            .catch(function (reason) {
                res.send('<p>' + reason + '</p>');
            });
    });

    router.get('/about', function(req, res) {
        service.getMenu(req)
            .then(function (req) {
                res.render('about.html', req);
            })
            .catch(function (reason) {
                res.send('<p>' + reason + '</p>');
            });
    });

    return {
        path: '',
        router: router
    };

})();
