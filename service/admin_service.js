
var path = require('path');
var config = require('../config/config');
var mysql = require('../dao/mysql');

module.exports = (function () {
    var low = function (req) {
        return (req.page - 1) * req.limit;
    };

    var high = function (req) {
        var high = low(req) + req.limit;
        return (high <= req.total) ? high : req.total;
    };

    var total = req => new Promise((resolve, reject) => { req.total = req.data[0].total; resolve(req) });

    return {
        getUserByName: function(req) {
            req.sql = 'select * from t_user where `name`=?';
            req.params = [req.name];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.user = req.data[0]; resolve(req) }));
        },
        // return accesses
        getAccessByRole: function(req) {
            req.sql = 'select `access` from `t_role_access` where `role`=? ';
            req.params = [req.id];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.accesses = req.data; resolve(req) }));
        },
        // menus
        getMenu: function (req) {
            req.sql = 'select `name`, `logo`, `url`, `access` from `t_menu_item` where `status`=0 order by `order`';
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.menus = req.data; resolve(req) }));
        },
        getTagCount: function (req) {
            req.sql = 'select count(1) as total from `t_tag` where status=0';
            return mysql.query(req).then(total);
        },
        getTagList: function (req) {
            req.sql = 'select `id`, `status`, `name` ' +
                'from `t_tag` where status=0 order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.tags = req.data; resolve(req) }));
        },
        updateTag: function (req) {
            req.sql = 'update t_tag set name=? where id=?';
            req.params = [req.name, req.id];
            return mysql.query(req);
        },
        insertTag: function (req) {
            req.sql = 'insert into t_tag(status, name) values(0, ?)';
            req.params = [req.name];
            return mysql.query(req);
        },
        deleteTag: function (req) {
            req.sql = 'update t_tag set status=1 where id=?';
            req.params = [req.id];
            return mysql.query(req);
        },
        getAccessCount: function (req) {
            req.sql = 'select count(1) as total from `t_access` where status=0';
            return mysql.query(req).then(total);
        },
        getAccessList: function (req) {
            req.sql = 'select `id`, `access`, `status`, `name` ' +
                'from `t_access` where status=0 order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.list = req.data; resolve(req) }));
        },
        updateAccess: function (req) {
            req.sql = 'update t_access set access=?, name=? where id=?';
            req.params = [req.access, req.name, req.id];
            return mysql.query(req);
        },
        insertAccess: function (req) {
            req.sql = 'insert into t_access(status, access, name) values(0, ?, ?)';
            req.params = [req.access, req.name];
            return mysql.query(req);
        },
        deleteAccess: function (req) {
            req.sql = 'update t_access set status=1 where id=?';
            req.params = [req.id];
            return mysql.query(req);
        },
        getMenuCount: function (req) {
            req.sql = 'select count(1) as total from `t_menu_item` where status=0';
            req.params = [];
            return mysql.query(req).then(total);
        },
        getMenuList: function (req) {
            req.sql = 'select `id`, `name`, `order`, `access`, `logo`, `url` ' +
                'from `t_menu_item` where status=0 order by `order` limit ?,?';
            req.params = [low(req), high(req)];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.menus = req.data; resolve(req) }));
        },
        updateMenu: function (req) {
            req.sql = 'update t_menu_item set `name`=?, `order`=?, `access`=?, `logo`=?, `url`=? where `id`=?';
            req.params = [req.name, req.order, req.access, req.logo, req.url, req.id];
            return mysql.query(req);
        },
        insertMenu: function (req) {
            req.sql = 'insert into t_menu_item(`status`, `name`, `order`, `access`, `logo`, `url`) values(0, ?, ?, ?, ?, ?)';
            req.params = [req.name, req.order, req.access, req.logo, req.url];
            return mysql.query(req);
        },
        deleteMenu: function (req) {
            req.sql = 'update t_menu_item set status=1 where id=?';
            req.params = [req.id];
            return mysql.query(req);
        },
        getRoleCount: function (req) {
            req.sql = 'select count(1) as total from `t_role` where status=0';
            req.params = [];
            return mysql.query(req).then(total);
        },
        getRoleList: function (req) {
            req.sql = 'select `id`, `name` ' +
                'from `t_role` where `status`=0 order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.roles = req.data; resolve(req) }));
        },
        updateRole: function (req) {
            req.sql = 'update t_role set name=? where id=?';
            req.params = [req.name, req.id];
            return mysql.query(req);
        },
        insertRole: function (req) {
            req.sql = 'insert into t_role(status, name) values(0, ?)';
            req.params = [req.name];
            return mysql.query(req)
        },
        delRole: function (req) {
            req.sql = 'update t_role set status=1 where id=?';
            req.params = [req.id];
            return mysql.query(req)
        },
        getArticleCount: function (req) {
            req.sql = 'select count(1) as total from `t_article`';
            req.params = [];
            return mysql.query(req).then(total);
        },
        getArticleList: function (req) {
            req.sql = 'select `id`, `title`, `summary`, `status`, `create_by`, ' +
                'date_format(`create_at`, "%Y-%c-%e %l:%i:%s") as create_at, date_format(`modify_at`, "%Y-%c-%e %l:%i:%s") as modify_at ' +
                'from `t_article` order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.articles = req.data; resolve(req) }));
        },
        updateArticle: function (req) {
            req.sql = 'update t_article set `title`=?, `summary`=?, `status`=? where id=?';
            req.params = [req.title, req.summary, req.status, req.id];
            return mysql.query(req);
        },
        insertArticle: function (req) {
            req.sql = 'insert into t_article(`status`, `title`, `summary`,`create_by`) values(?, ?, ?, 10000)';
            req.params = [req.status, req.title, req.summary];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.id = req.data.insertId; resolve(req) }));
        },
        delArticle: function (req) {
            req.sql = 'update t_article set status=1 where id=?';
            req.params = [req.id];
            return mysql.query(req);
        },
        getArticleBody: function (req) {
            req.filepath = path.join(config.path.upload, req.id + '.md');
            return mysql.readfile(req).then(req => new Promise((resolve, reject) => { req.md = req.data; resolve(req) }));
        },
        updateArticleBody: function (req) {
            req.filepath = path.join(config.path.upload, req.id + '.md');
            return mysql.writefile(req);
        },
        getAllRoles: function (req) {
            req.sql = 'select `id`, `name` from `t_role` where `status`=0 order by `id` desc';
            req.params = [];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.roles = req.data; resolve(req) }));
        },
        getUserCount: function (req) {
            req.sql = 'select count(1) as total from `t_user` where status=0';
            req.param = [];
            return mysql.query(req).then(total);
        },
        getUserList: function (req) {
            req.sql = 'select `id`, `name`, `role`, `status` ' +
                'from `t_user` where status=0 order by `id` desc limit ?,?';
            req.params = [low(req), high(req)];
            return mysql.query(req).then(req => new Promise((resolve, reject) => { req.users = req.data; resolve(req) }));
        },
        updateUser: function (req) {
            req.sql = 'update t_user set name=?, role=? where id=?';
            req.params = [req.name, req.role, req.id];
            return mysql.query(req);
        },
        insertUser: function (req) {
            req.sql = 'insert into t_user(status, name, role) values(0, ?, ?)';
            req.paramms = [req.name, req.role];
            return mysql.query(req);
        },
        deleteUser: function (req) {
            req.sql = 'update t_user set status=1 where id=?';
            req.params = [req.id];
            return mysql.query(req);
        }
    }
})();
