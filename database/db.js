const mysql = require("mysql2");
const user = 1; // inorder to replace db need to chagne the number
let db = null;
if (user === 1) {
  db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Michal6354!",
    port: 3306,
    database: "FullStackProject6",
  });
} else {
  db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Mysql1864",
    port: 3306,
    database: "FullStackProject6",
  });
}

module.exports = db;
