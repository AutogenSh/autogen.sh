const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const nunjucks = require('nunjucks')
const moment = require("moment")
const port = process.env.PORT || 8888


const app = express()
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: false
})
moment.format

// Traverse 'routes' directory, execute require & app.use
function load_routes(dir) {
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

request_filter = function (req, res, next) {
    console.log('%s url[%s]', moment().format("YYYY-MM-DD HH:mm:ss.SSS"), req.url)
    next()
}

// login_filter = function (req, res, next) {
//     console.log(moment().format("YYYY-MM-DD HH:mm:ss.SSS") + ' load_menu')
//     next()
// }

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cookieParser())
app.use(express.static(__dirname + '/public'))
app.use(request_filter)
// app.use(login_filter)
load_routes('routes')

const server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen at http://%s:%s', host, port);
})
