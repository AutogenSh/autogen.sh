const express = require('express')
const db = require('../config/db')
const marked = require('marked')
const fs = require('fs')
const page = express.Router()

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
})

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

load_article_detail = function (param) {
    return new Promise(function (resolve, reject) {
        sql = 'select id, status, title, summary, create_by, create_at, modify_at from t_article where id=?'
        db.query(sql, [param.id], function (err, article) {
            if (err) {
                reject(err)
            } else {
                param.article = article[0]
                resolve(param)
            }
        })
    })
}

load_markdown = function (param) {
    return new Promise(function (resolve, reject) {
        var path = 'public/uploads/' + param.article.id + '.md'
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                reject(err)
            } else {
                param.md = marked(data)
                resolve(param)
            }
        })
    })
}

page.get('/:id', function (req, res) {
    var param = {}
    param.id = req.params.id
    load_menu(param)
        .then(load_article_detail)
        .then(load_markdown)
        .then(function (param) {
            res.render('page.html', param)
        })
        .catch(function (reason) {
            res.end('<p>' + reason + '</p>')
        })
})

page._path = '/p'
module.exports = page
