const express = require("express");
const router = express.Router();
const db = require('../database/db');

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// GET all posts
router.get("/", async (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'SELECT * FROM posts';
    connection.query(query, (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.length === 0) {
          //404 - Data not found
        return res.status(404).send('Data not found');
      } else {
        res.json(results);
      }
    });
  });
});

// GET all posts of user
router.get("/:userid", async (req, res) => {

    // Retrieve user ID from request parameters
    const userId = req.params.userid;
  
    // Connect to the database
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      }
  
      // Prepare and execute the SQL query
      const query = 'SELECT * FROM posts WHERE userId = ?';
      connection.query(query, [userId], (err, results) => {
        connection.release();
  
        if (err) {
          console.error('Error executing query:', err);
          //500 - Internal server error
          return res.status(500).send('An error occurred');
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
  const {userId, postid} = req.params;
 db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      }
  
      // Prepare and execute the SQL query
      const query = 'SELECT * FROM posts WHERE id = ?';
      connection.query(query, [postid], (err, results) => {
        connection.release();
  
        if (err) {
          console.error('Error executing query:', err);
          //500 - Internal server error
          return res.status(500).send('An error occurred');
        } else if (results.length === 0) {
            //404 - Post not found
          return res.status(404).send('Post not found');
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
  console.log(req.body);
  const {userId, title, body} = req.body;
  
    // Connect to the database
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      }
  
      // Prepare and execute the SQL query
      const query = 'INSERT INTO posts (userId, title, body) VALUES (?, ?)';
      connection.query(query, [userId, title, body], (err, results) => {
        connection.release();
  
        if (err) {
          console.error('Error executing query:', err);
        //500 - Internal server error
          return res.status(500).send('An error occurred');
        } else {
        //201 - Poat created successfully
          res.status(201).json({ message: 'Post created successfully' });
        }
      });
    });
});

module.exports = router;
