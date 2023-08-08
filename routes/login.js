const express = require("express");
const router = express.Router();
const db = require("../database/db");

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// POST login
router.post("/", (req, res) => {
  const { password, username } = req.body;

  // Check the credentials against the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).send("An error occurred");
    }
    const query = "SELECT * FROM passwords WHERE username = ? AND password = ?";
    connection.query(query, [username, password], (err, results) => {
      connection.release(); // Release the connection

      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("An error occurred");
      } else if (results.length === 0) {
        return res.status(401).send("Invalid username or password");
      } else {
        // Successful login
        console.log("Logged in successfully");
        const id = results[0].userId; // Access the 'id' property of the first element
        console.log("result: "+id);
        console.log(results[0]);
        connection.query(
          "SELECT * FROM users WHERE id = ?",
          id,
          (err, results) => {
            if (err) {
              console.error("Error executing query:", err);
              return res.status(500).send("An error occurred");
            } else if (results.length === 0) {
              return res.status(401).send("Invalid username or password");
            } else {
              res.json(results[0]);
              console.log(results[0]);
            }
          }
        );
      }
    });
  });
});

// POST user
router.post("/", (req, res) => {
  const user = {
    id: 1, // TODO id from DB
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    website: req.body.website,
    company: req.body.company,
  };

  // check if user already exists in DB -> if true, return?
  // add user to DB

  res.send(user);
});

//שינוי סיסמה

module.exports = router;
