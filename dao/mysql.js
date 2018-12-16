
var fs = require('fs');
var config = require('../config/config');

module.exports = (function () {
    var query_mysql = function (sql, params, success, error) {
        config.mysql.getConnection(function (err, conn) {
            if (err) {
                console.log('mysql.getConnection error, sql: %s, errmsg: %s', sql, err);
                error(err);
            } else {
                conn.query(sql, params, function (err, data) {
                    conn.release();
                    if (err) {
                        console.log('conn.query error, sql: %s, errmsg: %s', sql, err);
                        console.log(err);
                        error(err);
                    } else {
                        success(data);
                    }
                })
            }
        })
    };

    /*
     * function query(req);
     * in:
     * req.sql     sql
     * req.params  a array: [], parameters for sql
     * 
     * out:
     * req.data    result columns
     */
    var query = function (req) {
        return new Promise(function (resolve, reject) {
            if (req.params == null) {
                req.params = [];
            }
            query_mysql(req.sql, req.params, function success(data) {
                req.data = data;
                resolve(req);
            }, function error(err) {
                reject(err);
            });
        });
    };

    var readfile = function(req) {
        return new Promise(function (resolve, reject) {
            fs.readFile(req.filepath, 'utf8', function (err, data) {
                if (err) {
                    console.log('fs.readFile error, path: %s, errmsg: %s', req.filepath, err);
                    reject(err);
                } else {
                    req.data = data;
                    resolve(req);
                }
            })
        });
    };

    var writefile = function(req) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(req.filepath, req.body, 'utf8', function (err) {
                if (err) {
                    console.log('fs.writeFile error, path: %s, errmsg: %s', req.filepath, err);
                    reject(err);
                } else {
                    resolve(req);
                }
            })
        });
    };

    return {
        query: query,
        readfile: readfile,
        writefile: writefile,
    };
})();
