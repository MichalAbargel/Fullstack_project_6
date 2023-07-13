const express = require("express");
const router = express.Router();
const db = require("../database/db");

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// POST register (add user)
router.post("/", (req, res) => {
  const { name, email, phone, website, username, password } = req.body;

  // Check if username already exists
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return res.status(500).send("An error occurred");
    }

    connection.query(
      "SELECT * FROM users WHERE username = ?",
      username,
      (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).send("An error occurred");
        } else if (results.length > 0) {
          // Username already exists
          console.log("\n" + results.length + "\n" + results[0] + "\n");
          return res.status(409).send("Username is already taken.");
        } else {
          // Add a new user to the database
          addUser(name, email, phone, website, username, (err, userId) => {
            if (err) {
              console.error("Error adding user:", err);
              return res.status(500).send("An error occurred");
            }
            console.log("\nAdd User\n");
            // Username does not exist, add the user's password
            addPassword(username, password, (err) => {
              if (err) {
                console.error("Error adding password:", err);
                // Delete user
                return res.status(500).send("An error occurred");
              }
              console.log("\nAdd Passwords\n");

              // Get the user details from the database
              getDetails(username, (err, userData) => {
                if (err) {
                  console.error("Error getting user details:", err);
                  return res.status(500).send("An error occurred");
                }
                console.log("\nGet Details\n"+userData);
                return res.status(201).json(userData);
              });
            });
          });
        }
      }
    );
  });
});

// Add a new user to the database
const addUser = (name, email, phone, website, username, callback) => {
  db.query(
    "INSERT INTO users (name, email, phone, website, username, api_key) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, phone, website, username, generateUniqueKey()],
    (err, result) => {
      if (err) {
        return callback(err, null);
      }

      const userId = result.insertId;
      console.log("\n id: " + userId + "\n");
      callback(null, userId);
    }
  );
};

// Add a new password to the database
const addPassword = (username, password, callback) => {
  db.query(
    "INSERT INTO passwords (username, password) VALUES (?, ?)",
    [username, password],
    (err, result) => {
      if (err) {
        return callback(err);
      }

      callback(null, true);
    }
  );
};

// Get user details from the database
const getDetails = (username, callback) => {
  db.query(
    "SELECT * FROM users WHERE username = ?",
    username,
    (err, results) => {
      if (err) {
        return callback(err, null);
      } else if (results.length === 0) {
        return callback(Error("Invalid username"), null);
      } else {
        callback(null, results[0]);
      }
    }
  );
};

// Create API key
const generateUniqueKey = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const keyLength = 20;
  let apiKey = "";

  for (let i = 0; i < keyLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters[randomIndex];
  }

  return apiKey;
};

module.exports = router;
