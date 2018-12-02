var mysql = require("mysql");

var pool = mysql.createPool({
    charset:"utf8mb4_general_ci",
    host:"192.168.0.1",
    port:"3306",
    user:"autogen",
    password:"123456",
    database:"autogen"
});

// cb = function(err, rows)
var query = function(sql, cb) {
    pool.getConnection(function(err, conn){
        conn.query(sql, function(err, rows) {
            cb(err, rows)
            conn.release()
        })
    })
}

module.exports = {
    query
}
