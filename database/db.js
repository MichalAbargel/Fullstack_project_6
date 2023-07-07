const mysql = require('mysql2');
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "MySQL01#943",
    port: 3306,
    database: 'project_6_database'
});

module.exports = db;
