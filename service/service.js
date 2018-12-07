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

    this.get_menu_item = function (param) {
        return new Promise(function (resolve, reject) {
            sql = 'select `name`, `logo`, `url` from `t_menu_item` where `status`=0 order by `order`'
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

    this.get_article_detail = function (param) {
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

    this.get_markdown = function (param) {
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

    this.get_article_count = function (param) {
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

    this.get_article_list = function (param) {
        return new Promise(function (resolve, reject) {
            var low = (param.page - 1) * param.limit
            var high = low + param.limit
            high = (high <= param.total) ? high : param.total
            sql = 'select `id`, `title`, `summary`, `create_by`, `create_at`, `modify_at` ' +
                'from `t_article` where `status`=? order by `create_at` desc limit ?,?'
            // console.log('#home ==> limit[%d] page[%d]\nsql[%s]', param.limit, param.page, sql)
            service.query(sql, [1, low, high], function (err, articles) {
                if (err) {
                    reject(err)
                } else {
                    param.articles = articles
                    // console.log('##### get_article_list page=', param)
                    resolve(param)
                }
            })
        })
    }


    //------------------------------
    
    
    this.get_tag_count = function (param) {
        return new Promise(function (resolve, reject) {
            sql = 'select count(1) as total from `t_tag` where status=0'
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

    this.get_tag_list = function (param) {
        return new Promise(function (resolve, reject) {
            var low = (param.page - 1) * param.limit
            var high = low + param.limit
            high = (high <= param.total) ? high : param.total
            sql = 'select `id`, `status`, `name` ' +
                'from `t_tag` where status=0 order by `id` desc limit ?,?'
            // console.log('#home ==> limit[%d] page[%d]\nsql[%s]', param.limit, param.page, sql, low, high)
            service.query(sql, [low, high], function (err, tags) {
                if (err) {
                    reject(err)
                } else {
                    param.tags = tags
                    // console.log('##### get_article_list page=', param)
                    resolve(param)
                }
            })
        })
    }

    this.update_tag = function(param) {
        return new Promise(function (resolve, reject) {
            sql = 'update t_tag set name=? where id=?'
            // console.log('#home ==> id[%d] name[%s]\nsql[%s]', param.id, param.name, sql)
            service.query(sql, [param.name, param.id], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(param)
                }
            })
        })
    }

    this.insert_tag = function(param) {
        return new Promise(function (resolve, reject) {
            sql = 'insert into t_tag(status, name) values(0, ?)'
            service.query(sql, [param.name], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(param)
                }
            })
        })
    }

    this.del_tag = function(param) {
        return new Promise(function (resolve, reject) {
            sql = 'update t_tag set status=1 where id=?'
            service.query(sql, [param.id], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(param)
                }
            })
        })
    }

    //------------------------------
    
    
    this.get_access_count = function (param) {
        return new Promise(function (resolve, reject) {
            sql = 'select count(1) as total from `t_access` where status=0'
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

    this.get_access_list = function (param) {
        return new Promise(function (resolve, reject) {
            var low = (param.page - 1) * param.limit
            var high = low + param.limit
            high = (high <= param.total) ? high : param.total
            sql = 'select `id`, `access`, `status`, `name` ' +
                'from `t_access` where status=0 order by `id` desc limit ?,?'
            // console.log('#home ==> limit[%d] page[%d]\nsql[%s]', param.limit, param.page, sql, low, high)
            service.query(sql, [low, high], function (err, list) {
                if (err) {
                    reject(err)
                } else {
                    param.list = list
                    resolve(param)
                }
            })
        })
    }

    this.update_access = function(param) {
        return new Promise(function (resolve, reject) {
            sql = 'update t_access set access=?, name=? where id=?'
            // console.log('#home ==> id[%d] name[%s]\nsql[%s]', param.id, param.name, sql)
            service.query(sql, [param.access, param.name, param.id], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(param)
                }
            })
        })
    }

    this.insert_access = function(param) {
        return new Promise(function (resolve, reject) {
            sql = 'insert into t_access(status, access, name) values(0, ?, ?)'
            service.query(sql, [param.access, param.name], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(param)
                }
            })
        })
    }

    this.del_access = function(param) {
        return new Promise(function (resolve, reject) {
            sql = 'update t_access set status=1 where id=?'
            service.query(sql, [param.id], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(param)
                }
            })
        })
    }

    //------------------------------
    
    
    this.get_menu_count = function (param) {
        return new Promise(function (resolve, reject) {
            sql = 'select count(1) as total from `t_menu_item` where status=0'
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

    this.get_menu_list = function (param) {
        return new Promise(function (resolve, reject) {
            var low = (param.page - 1) * param.limit
            var high = low + param.limit
            high = (high <= param.total) ? high : param.total
            sql = 'select `id`, `name`, `order`, `access`, `logo`, `url` ' +
                'from `t_menu_item` where status=0 order by `order` limit ?,?'
            // console.log('#home ==> limit[%d] page[%d]\nsql[%s]', param.limit, param.page, sql, low, high)
            service.query(sql, [low, high], function (err, menus) {
                if (err) {
                    reject(err)
                } else {
                    param.menus = menus
                    // console.log('##### get_article_list page=', param)
                    resolve(param)
                }
            })
        })
    }

    this.update_menu = function(param) {
        return new Promise(function (resolve, reject) {
            sql = 'update t_menu_item set `name`=?, `order`=?, `access`=?, `logo`=?, `url`=? where `id`=?'
            console.log('#home ==> id[%d] name[%s] order[%d] access[%s] logo[%s] url[%s]\nsql[%s]', param.id, param.name, param.order, param.access, param.logo, param.url, sql)
            service.query(sql, [param.name, param.order, param.access, param.logo, param.url, param.id], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(param)
                }
            })
        })
    }

    this.insert_menu = function(param) {
        return new Promise(function (resolve, reject) {
            sql = 'insert into t_menu_item(`status`, `name`, `order`, `access`, `logo`, `url`) values(0, ?, ?, ?, ?, ?)'
            console.log('#home ==> name[%s] order[%d] access[%s] logo[%s] url[%s]\nsql[%s]', param.name, param.order, param.access, param.logo, param.url, sql)
            service.query(sql, [param.name, param.order, param.access, param.logo, param.url], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(param)
                }
            })
        })
    }

    this.del_menu = function(param) {
        return new Promise(function (resolve, reject) {
            sql = 'update t_menu_item set status=1 where id=?'
            service.query(sql, [param.id], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(param)
                }
            })
        })
    }

}

var service = new Service();
module.exports = service
