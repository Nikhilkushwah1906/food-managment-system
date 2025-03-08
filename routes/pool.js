const mysql = require('mysql');
var pool = mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'nikku@1906',
    database:'food_management',
    multipleStatements:true,
    connectionLimit:100
});

module.exports = pool;