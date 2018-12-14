/*
 *
 *
 */
var config = require('./config/config');
var nunjucks = require('nunjucks');
var marked = require('marked');
var mysql = require('mysql');
var redis = require('redis');
var SphinxClient = require ("sphinxapi");
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
// var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var express = require('express');
var filter = require('./filter/filter');
var app = express();

(function () {
    var port = process.env.PORT || 8888;

    var init = function () {
        config.nunjucks.express = app;
        nunjucks.configure(config.path.view, config.nunjucks);
        marked.setOptions(config.marked);
        config.mysql = mysql.createPool(config.mysql_config);
        config.redis = redis.createClient(config.redis_config);
        config.sphinx = new SphinxClient();
        config.sphinx.SetServer(config.sphinx_config.host, config.sphinx_config.port);
        config.sphinx.SetMatchMode(SphinxClient.SPH_MATCH_EXTENDED);

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser('autogen-'));
        app.use(session({
            secret: 'autogen-',
            cookie: config.cookie,
            resave: true,
            saveUninitialized: false,
            store: new RedisStore(config.redis_config)
        }));
        app.use(express.static(config.path.static));
        app.use(filter.before);
        regist('controller');
        // app.use(filter.page_not_found);
        // app.use(filter.server_error);
    }

    var run = function () {
        var server = app.listen(port, function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('listen at http://%s:%s', host, port);
        })
    }

    var regist = function (dir) {
        var fs = require('fs');
        fs.readdir(dir, function (err, files) {
            if (err) {
                console.log(err);
                return false;
            }
            files.forEach(function (name) {
                if (path.extname(name) == '.js') {
                    cls = path.basename(name, '.js')
                    console.log('regist controller: %s', cls)
                    eval(('{cls}=require("./{dir}/{cls}");' +
                        'app.use({cls}.path, {cls}.router);')
                        .replace(/{cls}/g, cls)
                        .replace(/{dir}/g, dir));
                }
            })
        })
    }

    init();
    run();

})();
