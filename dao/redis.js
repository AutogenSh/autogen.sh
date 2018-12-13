
var config = require('../config/config');

var cache = (function () {

    client.on('error', function (err) {
        console.log('reids error, errmsg: %s', err);
      });

    var redis_get = function (key, success, error) {
        config.redis.get(key, function (err, res) {
            if (err) {
                console.log('cache.get error, key: %s, errmsg: %s', key, err);
                error(err);
            } else {
                success(res);
            }
        });
    };

    var redis_set = function(key, val, success, error) {
        config.redis.set(key, val, function(err, res) {
            if (err) {
                console.log('cache.set error, key: %s, val: %s, errmsg: %s', key, val, err);
                error(err);
            } else {
                success(res);
            }
        });
    }

    var get = function (req) {
        return new Promise(function (resolve, reject) {
            redis_get(req.key, function success(data) {
                req.data = data;
                resolve(req);
            }, function error(err) {
                reject(err);
            });
        });
    };

    var set = function () {
        return new Promise(function (resolve, reject) {
            redis_set(req.key, req.val, function success(data) {
                req.data = data;
                resolve(req);
            }, function error(err) {
                reject(err);
            });
        });
    };

    return {
        get: get,
        set: set
    };
})();

module.exports = cache;
