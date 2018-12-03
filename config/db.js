var mysql = require("mysql");

var pool = mysql.createPool({
    charset:"utf8mb4_general_ci",
    host:"192.168.50.128",
    port:"3306",
    user:"autogen",
    password:"12345678",
    database:"autogen"
});

// cb = function(err, rows)
var query = function(sql, values, cb) {
    pool.getConnection(function(err, conn){
        if (err) {
            console.log(err)
        } else {
            conn.query(sql, values, function(err, rows) {
                cb(err, rows)
                conn.release()
            })
        }
    })
}

module.exports = {
    query
}
