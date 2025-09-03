// // Start mysql connection
// let mysql = require('mysql');

// let con = mysql.createConnection({
//     host: "localhost",
//     user: "yourusername",
//     password: "yourpassword"
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

var mysql = require('mysql2');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api'
});

connection.connect();