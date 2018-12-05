/*
 *
 *
 */
Admin = function () {
    this.router = require('express').Router();
    this.path = '/admin';
    this.service = require('../service/service')

    this.print = function (res) {
        console.log('!!!!!!!!!!!!!!!!!!!!! ' + res.tpldict.aaa)
    }

    this.regist = function () {
        this.router.get('/tag', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            param.pageid = req.body.pageid || 1
            param.limit = 3
            admin.print(res)
            admin.service.load_menu(param)
                .then(function (param) {
                    res.render('admin/tag.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })
    }
}

var admin = new Admin()
module.exports = admin


