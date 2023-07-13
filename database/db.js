const mysql = require("mysql2");
const db = null;
try {
  db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Mysql1864",
    port: 3306,
    database: "FullStackProject6",
  });
} catch (E) {
  db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Michal635!",
    port: 3306,
    database: "FullStackProject6",
  });
}

module.exports = db;
