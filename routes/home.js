const express = require('express')
const db = require('../config/db')
const home = express.Router()

home.get('/', function (req, res) {
    sql = 'select `name`, `logo`, `permission` from `t_menu_item` order by `order`'
    db.query(sql, function (err, rows) {
        if (err) {
            res.statusCode = 502
            res.end(err)
        } else {
            res.render('index.html', {items: rows})
        }
    })
})

home.get('/about', function about(req, res) {
    sql = 'select `name`, `logo`, `permission` from `t_menu_item` order by `order`'
    db.query(sql, function (err, rows) {
        if (err) {
            res.statusCode = 502
            res.end(err)
        } else {
            res.render('about.html', {items: rows})
        }
    })
})

home._path = ''
module.exports = home
