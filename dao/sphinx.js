
var config = require('../config/config');

var sphinx = (function () {
    var query_sphinx = function (keyword, index, success, error) {
        config.sphinx.Query(keyword, index, function (err, result) {
            if (err) {
                console.log('sphinx.Query error, keyword: %s, index: %s, errmsg: %s', keyword, index, err);
                error(err);
            } else {
                success(result);
            }
        });
    };

    /*
     * function query(req);
     * in:
     * req.keyword     keyword
     * req.index       index
     * 
     * out:
     * req.data    result columns
     */
    var query = function (req) {
        return new Promise(function (resolve, reject) {
            if (req.params == null) {
                req.params = [];
            }
            query_sphinx(req.keyword, req.index, function success(data) {
                req.data = data;
                resolve(req);
            }, function error(err) {
                reject(err);
            });
        });
    };

    return {
        query: query
    };
})();

module.exports = sphinx;
