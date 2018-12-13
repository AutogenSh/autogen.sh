
var config = require('../config/config');

var sphinx = (function () {
    var query_sphinx = function (keyword, index, offset, limit, success, error) {
        if (limit > 0) {
            config.sphinx.SetLimits(offset, limit);
        }
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
     * req.tag     keyword
     * req.index   index
     * req.page    pageid
     * req.limit   limit
     * 
     * out:
     * req.data    result columns
     */
    var query = function (req) {
        return new Promise(function (resolve, reject) {
            if (req.params == null) {
                req.params = [];
            }
            query_sphinx(req.tag, req.index, (req.page - 1) * req.limit, req.limit, function success(data) {
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
