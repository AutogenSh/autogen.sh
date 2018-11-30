const express = require('express')
const nunjucks = require('nunjucks')
const moment = require("moment")
const port = process.env.PORT || 8888


const app = express()
nunjucks.configure('views', {
    autoescape: true,
    express: app
})

// Record request time
time_logger = function (req, res, next) {
    console.log(moment().format("YYYY-MM-DD HH:mm:ss.SSS"))
    next()
}

// Traverse 'routes' directory, execute require & app.use
function load_routes(dir) {
    app.use(express.static(__dirname + '/public'))
    app.use(time_logger)

    const fs = require('fs')
    fs.readdir(dir, function (err, files) {
        if (err) {
            console.log(err)
            return false
        }
        files.forEach(function (name) {
            if (name.endsWith('\.js')) {
                route = name.replace('\.js', '')
                js = ('{route}=require("./{dir}/{route}");' +
                    'app.use({route}._path, {route})')
                    .replace(/{route}/g, route)
                    .replace(/{dir}/g, dir)
                eval(js)
            }
        })
    })
}

load_routes('routes')

const server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen at http://%s:%s', host, port);
})
