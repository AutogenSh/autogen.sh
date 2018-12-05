/*
 *
 *
 */
Home = function () {
    this.router = require('express').Router();
    this.path = '';
    this.service = require('../service/service')

    this.regist = function () {

        this.router.post('/', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            param.pageid = req.body.pageid || 1
            param.limit = 3
            home.service.load_menu(param)
                .then(home.service.load_article_count)
                .then(home.service.load_article_list)
                .then(function (param) {
                    res.render('index.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })

        this.router.get('/', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            param.pageid = 1
            param.limit = 3
            home.service.load_menu(param)
                .then(home.service.load_article_count)
                .then(home.service.load_article_list)
                .then(function (param) {
                    res.render('index.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })

        this.router.get('/about', function about(req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            home.service.load_menu(param)
                .then(function (param) {
                    res.render('about.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })
    }
}

var home = new Home()
module.exports = home
