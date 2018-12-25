
var convert = require('../util/convert');
var moment = require("moment");
var service = require('../service/public_service');

module.exports = (function () {

    var indexOf = (list, element) => list.indexOf(element);

    var getClientIp = function (req) {
        var xForwardedFor = req.headers['x-forwarded-for'] || 'null';
        return xForwardedFor.replace(/ /g, '');  // replace space for awk
    };

    var before = function (req, res, next) {
        console.log('[%s] %s %s %s sessionID: %s', moment().format("YYYY-MM-DD HH:mm:ss.SSS"), getClientIp(req), req.method, req.url, req.sessionID);

        req.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex;
        if (req.method == 'GET' || req.method == 'HEAD') {
            req.page = convert.int(req.query.page, 1);
            req.limit = convert.int(req.query.limit, 10);
        } else if (req.method == 'POST') {
            req.page = convert.int(req.body.page, 1);
            req.limit = convert.int(req.body.limit, 10);
        }

        if (req.session.user == null || req.session.user.id == null) {
            req.session.user = service.getGuestUser();
        }

        req.has = indexOf;
        next();
    };

    var pageNotFound = function (req, res, next) {
        res.status(404);
        res.render('404.html', req);
    };

    var serverError = function (err, req, res, next) {
        console.log(err.stack);
        req.error = err;
        req.message = err.message;
        res.status(err.status || 500);
        res.render('500.html', req);
    };

    return {
        before: before,
        pageNotFound: pageNotFound,
        serverError: serverError,
    }
})();
