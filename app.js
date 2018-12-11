/*
 *
 *
 */ 
var config = require('./config/config');
var nunjucks = require('nunjucks');
var marked = require('marked');
var mysql = require('mysql');
var convert = require('./utils/convert');

Application = function () {
    this.expresscls = require('express');
    this.path = require('path')
    this.express = this.expresscls();
    this.bodyParser = require('body-parser');
    this.cookieParser = require('cookie-parser');
    this.session = require('express-session')
    this.moment = require("moment");
    this.port = process.env.PORT || 8888;

    this.init = function () {
        config.nunjucks.express = this.express;
        nunjucks.configure(config.path.view, config.nunjucks)
        marked.setOptions(config.marked)
        config.pool = mysql.createPool(config.mysql)

        this.express.use(this.bodyParser.json())
        this.express.use(this.bodyParser.urlencoded({ extended: true }));
        this.express.use(this.cookieParser('autogen'));
        // this.express.use(this.session({ secret: 'autogen'}));
        this.express.use(this.expresscls.static(config.path.static))
        this.express.use(this.before)
        // this.express.use(this.login_filter)
        this.regist('controller')
        this.express.use(this.after)
    }

    this.run = function () {
        var server = this.express.listen(this.port, function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('listen at http://%s:%s', host, port);
        })
    }

    this.regist = function (dir) {
        var fs = require('fs')
        fs.readdir(dir, function (err, files) {
            if (err) {
                console.log(err)
                return false
            }
            files.forEach(function (name) {
                if (app.path.extname(name) == '.js') {
                    cls = app.path.basename(name, '.js')
                    console.log('regist controller: %s', cls)
                    eval(('{cls}=require("./{dir}/{cls}");' +
                        'app.express.use({cls}.path, {cls}.router);')
                        .replace(/{cls}/g, cls)
                        .replace(/{dir}/g, dir))
                }
            })
        })
    }

    this.before = function (req, res, next) {
        req.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex;
        if (req.method == 'GET') {
            req.page = convert.int(req.query.page, 1);
            req.limit = convert.int(req.query.limit, 3);
        } else if (req.method == 'POST') {
            req.page = convert.int(req.body.page, 1);
            req.limit = convert.int(req.body.limit, 3);
        }
        console.log('req time[%s] method[%s] url[%s]', app.moment().format("YYYY-MM-DD HH:mm:ss.SSS"), req.method, req.url);
        next();
    };

    this.after = function (req, res, next) {
        next();
    };

    this.login_filter = function (req, res, next) {
        console.log(app.moment().format("YYYY-MM-DD HH:mm:ss.SSS") + ' load_menu');
        next();
    };
}

var app = new Application()
app.init()
app.run() 
