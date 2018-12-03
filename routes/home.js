const express = require('express')
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const db = require('../config/db')
const home = express.Router()

load_menu = function (param) {
    return new Promise(function (resolve, reject) {
        sql = 'select `name`, `logo`, `permission` from `t_menu_item` order by `order`'
        db.query(sql, [], function (err, menus) {
            if (err) {
                reject(err)
            } else {
                param.menus = menus
                resolve(param)
            }
        })
    })
}

load_article_count = function (param) {
    return new Promise(function (resolve, reject) {
        sql = 'select count(1) as total from `t_article`'
        db.query(sql, [], function (err, rows) {
            if (err) {
                reject(err)
            } else {
                param.total = rows[0].total
                resolve(param)
            }
        })
    })
}

load_article_list = function (param) {
    return new Promise(function (resolve, reject) {
        var low = (param.pageid - 1) * param.limit
        var high = low + param.limit
        high = (high <= param.total) ? high : param.total
        sql = 'select `id`, `title`, `summary`, `create_by`, `create_at`, `modify_at` ' +
            'from `t_article` where `status`=? order by `create_at` desc limit ?,?'
        // console.log('#home ==> limit[%d] page[%d]\nsql[%s]', param.limit, param.pageid, sql)
        db.query(sql, [1, low, high], function (err, articles) {
            if (err) {
                reject(err)
            } else {
                param.articles = articles
                // console.log('##### load_article_list page=', param)
                resolve(param)
            }
        })
    })
}

home.post('/', function (req, res) {
    var param = {}
    param.pageid = req.body.pageid || 1
    param.limit = 3
    load_menu(param)
        .then(load_article_count)
        .then(load_article_list)
        .then(function (param) {
            res.render('index.html', param)
        })
        .catch(function (reason) {
            res.end('<p>' + reason + '</p>')
        })
})

home.get('/', function (req, res) {
    var param = {}
    param.pageid = 1
    param.limit = 3
    load_menu(param)
        .then(load_article_count)
        .then(load_article_list)
        .then(function (param) {
            res.render('index.html', param)
        })
        .catch(function (reason) {
            res.end('<p>' + reason + '</p>')
        })
})

home.get('/about', function about(req, res) {
    var param = {}
    load_menu(param)
    .then(function (param) {
        res.render('about.html', param)
    })
    .catch(function (reason) {
        res.end('<p>' + reason + '</p>')
    })
})

home._path = ''
module.exports = home
