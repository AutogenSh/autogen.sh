/*
 * config file.
 * 
 */
var path = require('path');
var marked = require('marked');

var config = (function () {

    var dirs = (function () {
        var root = path.join(__dirname, '..');
        var static = path.join(root, 'static')

        return {
            root: root,
            view: path.join(root, '/view'),
            static: static,
            upload: path.join(static, '/uploads')
        };
    })();

    var mysql_config = (function () {
        return {
            host: '192.168.50.128',
            port: '3306',
            user: 'autogen',
            password: '12345678',
            database: 'autogen',
            charset: 'utf8mb4_general_ci',
            connectionLimit: 20,
            queueLimit: 0,
        };
    })();

    var redis_config = (function () {
        return {
            host: '192.168.50.128',
            port: 6379,
            db: 0
        };
    })();

    var nunjucks = (function () {
        return {
            autoescape: true,
            express: null,    // need to set in app.js
            noCache: false
        };
    })();

    var md = (function () {
        return {
            renderer: new marked.Renderer(),
            smartLists: true,
            smartypants: true
        };
    })();

    var cookie = (function () {
        return {
            // cookies save a month
            maxAge: 60 * 60 * 24 * 30
        };
    })();

    var sphinx_config = (function(){
        return {
            host: '192.168.50.128',
            port: 9312,
        };
    })();

    return {
        mysql: null,    // need to set in app.js
        redis: null,    // need to set in app.js
        sphinx: null,   // need to set in app.js
        path: dirs,
        mysql_config: mysql_config,
        redis_config: redis_config,
        sphinx_config: sphinx_config,
        nunjucks: nunjucks,
        marked: md,
        cookie: cookie
    };
})();

// console.log('config:\n%s', JSON.stringify(config, null, 4))

module.exports = config
