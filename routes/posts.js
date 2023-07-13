const express = require("express");
const router = express.Router();
const db = require("../database/db");

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// GET all posts
router.get("/", async (req, res) => {
  console.log("handle GET req in posts");

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "SELECT * FROM posts";
    connection.query(query, (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.length === 0) {
        //404 - Data not found
        return res.status(404).send("Data not found");
      } else {
        res.json(results);
      }
    });
  });
});

// GET all posts of user
router.get("/:userid", async (req, res) => {
  console.log("handle GET req in posts with userId");

  // Retrieve user ID from request parameters
  const userId = req.params.userid;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "SELECT * FROM posts WHERE userId = ?";
    connection.query(query, [userId], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.length === 0) {
        //404 - User's posts not found
        return res.status(404).send("User's posts not found");
      } else {
        //200- ok
        res.status(200).json(results);
      }
    });
  });
});

// GET post by id and userid
router.get("/:userid/:postid", async (req, res) => {
  console.log("handle GET req in posts with userId and Id");

  const { userId, postid } = req.params;
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "SELECT * FROM posts WHERE id = ?";
    connection.query(query, [postid], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.length === 0) {
        //404 - Post not found
        return res.status(404).send("Post not found");
      } else {
        //200- Success action
        res.status(200).json(results[0]);
      }
    });
  });
});

// POST add post
router.post("/", (req, res) => {
  console.log("handle post req");
  const { userId, title, body } = req.body;
  console.log(userId, title, body);

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "INSERT INTO posts (userId, title, body) VALUES (?, ?, ?)";
    connection.query(query, [userId, title, body], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else {
        //201 - Poat created successfully
        res.status(201).json({ message: "Post created successfully" });
      }
    });
  });
});

//PUT = update post
router.put("/", (req, res) => {
  console.log("handle PUT req in posts");

  // Retrieve user ID and updated data from request parameters and body
  const postId = req.params.id;
  const { title, body } = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "UPDATE posts SET title = ?, body = ? WHERE id = ?";
    connection.query(query, [title, body, postId], (err, results) => {
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

//Delete post
router.delete("/:postid", (req, res) => {
  console.log("handle DELTET req in posts");

  // Retrieve user ID from request parameters
  const postId = req.params.postid;
  console.log(postId);

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error

      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "DELETE FROM posts WHERE id = ?";
    connection.query(query, [postId], (err, results) => {
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
