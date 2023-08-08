const mysql = require("mysql2");
let db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Mysql1864",
    port: 3306,
    database: "mystore",
  });
module.exports = db;
