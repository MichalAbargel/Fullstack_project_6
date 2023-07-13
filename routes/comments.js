const express = require("express");
const router = express.Router();
const db = require("../database/db");

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// GET comments
router.get("/:postid", async (req, res) => {
  console.log("handle GET req in comments");

  // Retrieve user ID and post id from request parameters
  const postId = req.params.postid;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "SELECT * FROM comments WHERE postId = ?";
    connection.query(query, [postId], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.length === 0) {
        //404 - User not found
        return res.status(404).send("User not found");
      } else {
        console.log("results:");
        console.log(results);
        res.status(200).json(results);
      }
    });
  });
});

//POST = create comment
router.post("/", (req, res) => {
  console.log("handle POST req in comments");

  // Extract user data from the request body
  const { postId, name, email, body } = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query =
      "INSERT INTO comments (postId, name, email, body) VALUES (?, ?, ?, ?)";
    connection.query(query, [postId, name, email, body], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else {
        //201 - User created successfully
        res.status(201).json({ message: "User created successfully" });
      }
    });
  });
});

//PUT = update comment
router.put("/", (req, res) => {
  console.log("handle PUT req in comments");

  // Retrieve user ID and updated data from request parameters and body
  const commentId = req.params.id;
  const { body } = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "UPDATE comments SET body = ? WHERE id = ?";
    connection.query(query, [body, commentId], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.affectedRows === 0) {
        //404 - User not found
        return res.status(404).send("User not found");
      } else {
        res.json({ message: "User updated successfully" });
      }
    });
  });
});

//Delete comment
router.delete("/", (req, res) => {
  console.log("handle DELETE req in comments");

  // Retrieve user ID from request parameters
  const commentId = req.params.id;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error

      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "DELETE FROM comments WHERE id = ?";
    connection.query(query, [commentId], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.affectedRows === 0) {
        //404 - User not found
        return res.status(404).send("User not found");
      } else {
        res.json({ message: "User deleted successfully" });
      }
    });
  });
});

module.exports = router;
