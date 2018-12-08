/*
 *
 *
 */
Page = function() {
    this.router = require('express').Router();
    this.path = '/p';
    this.service = require('../service/service')

    this.regist = function() {
        this.router.get('/:id', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null)? 'true' : req.cookies.navex
            param.id = req.params.id
            page.service.get_menu_item(param)
                .then(page.service.get_article_detail)
                .then(page.service.get_markdown)
                .then(function (param) {
                    res.render('page.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })
    }
}

var page = new Page()
module.exports = page