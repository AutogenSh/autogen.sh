const express = require('express')
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const db = require('../config/db')
const home = express.Router()


home.get('/about', function about(req, res) {
    sql = 'select `name`, `logo`, `permission` from `t_menu_item` order by `order`'
    db.query(sql, function (err, rows) {
        if (err) {
            res.statusCode = 502
            res.end(err)
        } else {
            res.render('about.html', { items: rows })
        }
    })
})

load_menu = function (param) {
    return new Promise(function (resolve, reject) {
        sql = 'select `name`, `logo`, `permission` from `t_menu_item` order by `order`'
        db.query(sql, function (err, menus) {
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
        db.query(sql, function (err, rows) {
            if (err) {
                reject(err)
            } else {
                param.total = rows[0].total
                resolve(param)
            }
        })
    })
}

load_article = function (param) {
    return new Promise(function (resolve, reject) {
        var low = (param.pageid - 1) * param.limit
        var high = low + param.limit
        high = (high <= param.total) ? high : param.total
        sql = 'select `id`, `title`, `summary`, `create_by`, `create_at`, `modify_at` ' +
            'from `t_article` where `status`=1 order by `create_at` desc limit ' + low + ',' + high
        // console.log('#home ==> limit[%d] page[%d]\nsql[%s]', param.limit, param.pageid, sql)
        db.query(sql, function (err, articles) {
            if (err) {
                reject(err)
            } else {
                param.articles = articles
                // console.log('##### load_article page=', param)
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
        .then(load_article)
        .then(function (param) {
            res.render('index.html', param)
        })
        .catch(function (reason) {
            res.end('<p>' + reason + '</p>')
        })
})

home.get('/', function (req, res) {
    // req.cookies.pageid
    var param = {}
    param.pageid = 1
    param.limit = 3
    load_menu(param)
        .then(load_article_count)
        .then(load_article)
        .then(function (param) {
            res.render('index.html', param)
        })
        .catch(function (reason) {
            res.end('<p>' + reason + '</p>')
        })
})

home._path = ''
module.exports = home