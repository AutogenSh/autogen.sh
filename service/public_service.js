
var path = require('path');
var marked = require('marked')
var config = require('../config/config');
var mysql = require('../dao/mysql');
var sphinx = require('../dao/sphinx');

module.exports = (function() {
    var low = function(req) {
        return (req.page - 1) * req.limit;
    };

    var high = function(req) {
        var high = low(req) + req.limit;
        return (high <= req.total) ? high : req.total;
    };

    var total = req => new Promise((resolve, reject) => { req.total = req.data[0].total; resolve(req) });

    var guest = {
        id: 10001,
        status: 0,
        name: 'Guest',
        role: 10000,
        access: ['article'],
    };

    return {
        getGuestUser: function() {
            return guest;
        },
        searchArticle: function(req) {
            req.index = 'article';
            return sphinx.query(req);
        },
        // return accesses
        getAccessByRole: function(req) {
            req.sql = 'select `access` from `t_role_access` where `role`=? ';
            req.params = [req.id];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.accesses = req.data; resolve(req) }));
        },
        // return user
        getUserById: function(req) {
            req.sql = 'select `id`, `status`, `name`, `role` from `t_user` where `id`=? ';
            req.params = [req.id]; 
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.user = req.data[0]; resolve(req) }));
        },
        // return menus
        getMenu: function(req) {
            req.sql = 'select `name`, `logo`, `url`, `access` from `t_menu_item` where `status`=0 order by `order`';
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.menus = req.data; resolve(req) }));
        }, 
        // return total
        getPublishArticleCount: function(req) {
            req.sql = 'select count(1) as total from `t_article` where `status`=0';
            return mysql.query(req).then(total);
        }, 
        // return articles
        getPublishArticleList: function(req) {
            req.sql = 'select `id`, `title`, `summary`, `status`, `create_by`, ' +
            // 'date_format(`create_at`, "%Y-%c-%e %l:%i:%s") as create_at, ' + 
            // 'date_format(`modify_at`, "%Y-%c-%e %l:%i:%s") as modify_at ' +
            'create_at, ' + 
            'modify_at ' +
            'from `t_article` where `status`=0 order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.articles = req.data; resolve(req) }))
        }, 
        // return article
        getArticleDetail: function(req) {
            req.sql = 'select id, status, title, summary, create_by, create_at, modify_at from t_article where id=?';
            req.params = [req.id];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.article = req.data[0]; resolve(req) }))
        },
        // return md
        getMarkDown: function (req) {
            req.filepath = path.join(config.path.upload, req.id + '.md');
            return mysql.readfile(req).then(req => new Promise((resolve, reject) => { req.md = marked(req.data); resolve(req) }))
        }
    }
})();
