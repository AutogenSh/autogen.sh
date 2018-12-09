/*
 *
 *
 */ 
var config = require('./config/config');
var nunjucks = require('nunjucks');
var marked = require('marked');
var mysql = require('mysql');

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

        // this.config.init(this.express)
        this.express.use(this.bodyParser.json())
        this.express.use(this.bodyParser.urlencoded({ extended: true }));
        this.express.use(this.cookieParser('autogen'));
        // this.express.use(this.session({ secret: 'autogen'}));
        this.express.use(this.expresscls.static(config.path.static))
        this.express.use(this.request_filter)
        // this.express.use(this.login_filter)
        this.regist('controller')
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
                    eval(('{cls}=require("./{dir}/{cls}");' +
                        '{cls}.regist();' +
                        'app.express.use({cls}.path, {cls}.router);')
                        .replace(/{cls}/g, cls)
                        .replace(/{dir}/g, dir))
                }
            })
        })
    }

    this.request_filter = function (req, res, next) {
        res.tpldict = {}
        res.tpldict.aaa = 'hello!'
        console.log('%s host[%s] url[%s]', app.moment().format("YYYY-MM-DD HH:mm:ss.SSS"), req.hostname, req.url)
        next()
    }

    this.login_filter = function (req, res, next) {
        console.log(app.moment().format("YYYY-MM-DD HH:mm:ss.SSS") + ' load_menu')
        next()
    }
}

var app = new Application()
app.init()
app.run() 
