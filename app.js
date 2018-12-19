/*
 *
 *
 */
var fs = require('fs');
var path = require('path');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var config = require('./config/config');
var nunjucks = require('nunjucks');
var marked = require('marked');
var mysql = require('mysql');
var redis = require('redis');
var SphinxClient = require("sphinxapi");
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var helmet = require('helmet');
var cookieParser = require('cookie-parser');
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

        app.enable('trust proxy');
        app.use(helmet());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser('autogen-'));
        app.use(session({
            name: 'sid',
            secret: 'autogen-',
            cookie: config.cookie,
            resave: true,
            saveUninitialized: false,
            store: new RedisStore(config.redis_config)
        }));
        app.use(filter.before);
        regist('controller');
        eventEmitter.on('regist_completed', function (params) {
            app.use(filter.page_not_found);
            app.use(filter.server_error);
        });
    }

    var run = function () {
        var server = app.listen(port, function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('listen at http://%s:%s', host, port);
        })
    }

    var regist = function (dir) {
        fs.readdir(dir, function (err, files) {
            if (err) {
                console.log(err);
                return false;
            }
            files.forEach(function (name) {
                if (path.extname(name) == '.js') {
                    cls = path.basename(name, '.js');
                    console.log('regist controller: %s', cls);
                    eval(('{cls}=require("./{dir}/{cls}");' +
                        'app.use({cls}.path, {cls}.router);')
                        .replace(/{cls}/g, cls)
                        .replace(/{dir}/g, dir));
                }
            });
            eventEmitter.emit('regist_completed');
        });
    }

    init();
    run();

})();
