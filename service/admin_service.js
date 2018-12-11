
var path = require('path');
var marked = require('marked')
var config = require('../config/config');
var dao = require('../dao/dao');

var admin_service = (function () {
    var low = function (req) {
        return (req.page - 1) * req.limit;
    };

    var high = function (req) {
        var high = low(req) + req.limit;
        return (high <= req.total) ? high : req.total;
    };

    var total = req => new Promise((resolve, reject) => { req.total = req.data[0].total; resolve(req) });
    

    return {
        // menus
        get_menu: function (req) {
            req.sql = 'select `name`, `logo`, `url` from `t_menu_item` where `status`=0 order by `order`';
            return dao.query(req).then(req => new Promise((resolve, reject) => { req.menus = req.data; resolve(req) }));
        },
        get_tag_count: function (req) {
            req.sql = 'select count(1) as total from `t_tag` where status=0';
            return dao.query(req).then(total);
        }, 
        get_tag_list: function (req) {
            req.sql = 'select `id`, `status`, `name` ' +
            'from `t_tag` where status=0 order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return dao.query(req).then(req => new Promise((resolve, reject) => { req.tags = req.data; resolve(req) }));
        }, 
        update_tag: function (req) {
            req.sql = 'update t_tag set name=? where id=?';
            req.params = [req.name, req.id];
            return dao.query(req);
        },
        insert_tag: function(req) {
            req.sql = 'insert into t_tag(status, name) values(0, ?)';
            req.params = [req.name];
            return dao.query(req);
        },
        delete_tag: function(req) {
            req.sql = 'update t_tag set status=1 where id=?';
            req.params = [req.id];
            return dao.query(req);
        },
        get_access_count: function(req) {
            req.sql = 'select count(1) as total from `t_access` where status=0';
            return dao.query(req).then(total);
        },
        get_access_list: function(req) {
            req.sql =  'select `id`, `access`, `status`, `name` ' +
            'from `t_access` where status=0 order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return dao.query(req).then(req => new Promise((resolve, reject) => { req.list = req.data; resolve(req) }));
        },
        update_access: function(req) {
            req.sql = 'update t_access set access=?, name=? where id=?';
            req.params = [req.access, req.name, req.id];
            return dao.query(req);
        }, 
        insert_access: function(req) {
            req.sql = 'insert into t_access(status, access, name) values(0, ?, ?)';
            req.params = [req.access, req.name];
            return dao.query(req);
        },
        delete_access: function(req) {
            req.sql = 'update t_access set status=1 where id=?';
            req.params = [req.id];
            return dao.query(req);
        },
        get_menu_count: function(req) {
            req.sql = 'select count(1) as total from `t_menu_item` where status=0';
            req.params = [];
            return dao.query(req).then(total);
        }, 
        get_menu_list: function(req) {
            req.sql = 'select `id`, `name`, `order`, `access`, `logo`, `url` ' +
            'from `t_menu_item` where status=0 order by `order` limit ?,?';
            req.params = [low(req), high(req)];
            return dao.query(req).then(req => new Promise((resolve, reject) => { req.menus = req.data; resolve(req) }));
        },
        update_menu: function(req) {
            req.sql = 'update t_menu_item set `name`=?, `order`=?, `access`=?, `logo`=?, `url`=? where `id`=?';
            req.params = [req.name, req.order, req.access, req.logo, req.url, req.id];
            return dao.query(req);
        }, 
        insert_menu: function(req) {
            req.sql = 'insert into t_menu_item(`status`, `name`, `order`, `access`, `logo`, `url`) values(0, ?, ?, ?, ?, ?)';
            req.params = [req.name, req.order, req.access, req.logo, req.url];
            return dao.query(req);
        },
        delete_menu: function(req) {
            req.sql = 'update t_menu_item set status=1 where id=?';
            req.params = [req.id];
            return dao.query(req);
        },
        get_role_count: function(req) {
            req.sql = 'select count(1) as total from `t_role` where status=0';
            req.params = [];
            return dao.query(req).then(total);
        },
        get_role_list: function(req) {
            req.sql = 'select `id`, `name` ' +
            'from `t_role` where `status`=0 order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return dao.query(req).then(req => new Promise((resolve, reject) => { req.roles = req.data; resolve(req) }));
        },
        update_role: function(req) {
            req.sql = 'update t_role set name=? where id=?';
            req.params = [req.name, req.id];
            return dao.query(req);
        },
        insert_role: function(req) {
            req.sql = 'insert into t_role(status, name) values(0, ?)';
            req.params = [req.name];
            return dao.query(req)
        },
        del_role: function(req) {
            req.sql = 'update t_role set status=1 where id=?';
            req.params = [req.id];
            return dao.query(req)
        },
        get_article_count: function(req) {
            req.sql = 'select count(1) as total from `t_article`';
            req.params = [];
            return dao.query(req).then(total);
        }, 
        get_article_list: function(req) {
            req.sql = 'select `id`, `title`, `summary`, `status`, `create_by`, ' +
            'date_format(`create_at`, "%Y-%c-%e %l:%i:%s") as create_at, date_format(`modify_at`, "%Y-%c-%e %l:%i:%s") as modify_at ' +
            'from `t_article` order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return dao.query(req).then(req => new Promise((resolve, reject) => { req.articles = req.data; resolve(req) }));
        }, 
        update_article: function(req) {
            req.sql = 'update t_article set `title`=?, `summary`=?, `status`=? where id=?';
            req.params = [req.title, req.summary, req.status, req.id];
            return dao.query(req);
        },
        insert_article: function(req) {
            req.sql = 'insert into t_article(`status`, `title`, `summary`,`create_by`) values(?, ?, ?, 10000)';
            req.params = [req.status, req.title, req.summary];
            return dao.query(req).then(req => new Promise((resolve, reject) => { req.id = req.data.insertId; resolve(req) }));
        }, 
        del_article: function(req) {
            req.sql = 'update t_article set status=1 where id=?';
            req.params = [req.id];
            return dao.query(req);
        },
        get_article_body: function(req) {
            req.filepath = path.join(config.path.upload, req.id + '.md');
            return dao.readfile(req).then(req => new Promise((resolve, reject) => { req.md = req.data; resolve(req) }));
        },
        update_article_body: function(req) {
            req.filepath = path.join(config.path.upload, req.id + '.md');
            return dao.writefile(req);
        },
        get_allroles: function(req) {
            req.sql = 'select `id`, `name` from `t_role` where `status`=0 order by `id` desc';
            req.params = [];
            return dao.query(req).then(req => new Promise((resolve, reject) => { req.roles = req.data; resolve(req) }));
        },
        get_user_count: function(req) {
            req.sql = 'select count(1) as total from `t_user` where status=0';
            req.param = [];
            return dao.query(req).then(total);
        },
        get_user_list: function(req) {
            req.sql = 'select `id`, `name`, `role`, `status` ' +
            'from `t_user` where status=0 order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return dao.query(req).then(req => new Promise((resolve, reject) => { req.users = req.data; resolve(req) }));
        },
        update_user: function(req) {
            req.sql = 'update t_user set name=?, role=? where id=?';
            req.params = [req.name, req.role, req.id];
            return dao.query(req);
        }, 
        insert_user: function(req) {
            req.sql = 'insert into t_user(status, name, role) values(0, ?, ?)';
            req.paramms = [req.name, req.role];
            return dao.query(req);
        },
        delete_user: function(req) {
            req.sql = 'update t_user set status=1 where id=?';
            req.params = [req.id];
            return dao.query(req);
        }
    }
})();

module.exports = admin_service;
