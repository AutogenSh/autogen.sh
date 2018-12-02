const express = require('express')
const db = require('../config/db')
const page = express.Router()

page.get('/:id', function (req, res) {
    sql = 'select `name`, `logo`, `permission` from `t_menu_item` order by `order`'
    db.query(sql, function (err, rows) {
        if (err) {
            res.statusCode = 502
            res.end(err)
        } else {
            res.render('page.html', {items: rows})
        }
    })
})

page._path = '/p'
module.exports = page
