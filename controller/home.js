/*
 *
 *
 */
Home = function () {
    this.router = require('express').Router();
    this.path = '';
    this.service = require('../service/service')
    this.convert = require('../utils/convert')

    this.regist = function () {

        this.router.post('/', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            param.page = home.convert.int(req.body.page, 1)
            param.limit = home.convert.int(req.body.limit, 10)
            home.service.get_menu_item(param)
                .then(home.service.get_article_count)
                .then(home.service.get_article_list)
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
            param.page = home.convert.int(req.query.page, 1)
            param.limit = home.convert.int(req.query.limit, 10)
            home.service.get_menu_item(param)
                .then(home.service.get_article_count)
                .then(home.service.get_article_list)
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
            home.service.get_menu_item(param)
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
