
var convert = require('../util/convert');
var moment = require("moment");
var service = require('../service/public_service');

module.exports = (function () {

    var indexOf = (list, element) => list.indexOf(element);

    var before = function (req, res, next) {
        console.log('[%s] %s %s', moment().format("YYYY-MM-DD HH:mm:ss.SSS"), req.method, req.url);

        req.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex;
        if (req.method == 'GET' || req.method == 'HEAD') {
            req.page = convert.int(req.query.page, 1);
            req.limit = convert.int(req.query.limit, 10);
        } else if (req.method == 'POST') {
            req.page = convert.int(req.body.page, 1);
            req.limit = convert.int(req.body.limit, 10);
        }

        if (req.session.user == null || req.session.user.id == null) {
            req.session.user = service.get_guest_user();
        }

        req.has = indexOf;
        next();
    };

    var page_not_found = function (req, res, next) {
        res.status(404);
        res.render('404.html', req);
    };

    var server_error = function (err, req, res, next) {
        console.log(err.stack);
        req.error = err;
        req.message = err.message;
        res.status(err.status || 500);
        res.render('500.html', req);
    };

    return {
        before: before,
        page_not_found: page_not_found,
        server_error: server_error,
    }
})();
