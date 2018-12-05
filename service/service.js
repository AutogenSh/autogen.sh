/*
 *
 *
 */
Service = function () {
    this.fs = require('fs')
    this.marked = require('marked')
    this.config = require('../config/config')

    this.query = function (sql, values, cb) {
        this.config.pool.getConnection(function (err, conn) {
            if (err) {
                console.log(err)
            } else {
                conn.query(sql, values, function (err, rows) {
                    cb(err, rows)
                    conn.release()
                })
            }
        })
    }

    this.load_menu = function (param) {
        return new Promise(function (resolve, reject) {
            sql = 'select `name`, `logo`, `permission`, `url` from `t_menu_item` order by `order`'
            service.query(sql, [], function (err, menus) {
                if (err) {
                    reject(err)
                } else {
                    param.menus = menus
                    resolve(param)
                }
            })
        })
    }

    this.load_article_detail = function (param) {
        return new Promise(function (resolve, reject) {
            sql = 'select id, status, title, summary, create_by, create_at, modify_at from t_article where id=?'
            service.query(sql, [param.id], function (err, article) {
                if (err) {
                    reject(err)
                } else {
                    param.article = article[0]
                    resolve(param)
                }
            })
        })
    }

    this.load_markdown = function (param) {
        return new Promise(function (resolve, reject) {
            var path = service.config.upload_dir + '/' + param.article.id + '.md'
            service.fs.readFile(path, 'utf8', function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    param.md = service.marked(data)
                    resolve(param)
                }
            })
        })
    }


    this.load_article_count = function (param) {
        return new Promise(function (resolve, reject) {
            sql = 'select count(1) as total from `t_article`'
            service.query(sql, [], function (err, rows) {
                if (err) {
                    reject(err)
                } else {
                    param.total = rows[0].total
                    resolve(param)
                }
            })
        })
    }

    this.load_article_list = function (param) {
        return new Promise(function (resolve, reject) {
            var low = (param.pageid - 1) * param.limit
            var high = low + param.limit
            high = (high <= param.total) ? high : param.total
            sql = 'select `id`, `title`, `summary`, `create_by`, `create_at`, `modify_at` ' +
                'from `t_article` where `status`=? order by `create_at` desc limit ?,?'
            // console.log('#home ==> limit[%d] page[%d]\nsql[%s]', param.limit, param.pageid, sql)
            service.query(sql, [1, low, high], function (err, articles) {
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
}

var service = new Service();
module.exports = service
