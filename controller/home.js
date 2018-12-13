/*
 *
 *
 */
var publish_service = require('../service/publish_service');
var router = require('express').Router();

var home = (function () {
    router.get('/test', function(req, res) {
        req.keyword = req.query.keyword.trim();
        req.index = 'article';
        publish_service.test(req)
            .then(function(req) {
                res.end('<p>' + JSON.stringify(req.data) + '</p>');
            })
            .catch(function(reason){
                res.end('<p>' + reason + '</p>');
            });
    });

    router.all('/', function (req, res) {
        publish_service.get_menu(req)
            .then(publish_service.get_publish_article_count)
            .then(publish_service.get_publish_article_list)
            .then(function (req) { 
                res.render('index.html', req);
            })
            .catch(function (reason) {
                res.end('<p>' + reason + '</p>');
            });
    });

    router.get('/about', function(req, res) {
        publish_service.get_menu(req)
            .then(function (req) {
                res.render('about.html', req)
            })
            .catch(function (reason) {
                res.end('<p>' + reason + '</p>')
            });
    });

    router.get('/test', function (req, res) {
        req.test = {}
        req.test.name = 'test'
        req.test.val = 'test-val'
        res.json(req.test)
    });

    return {
        path: '',
        router: router
    };

})();

module.exports = home
