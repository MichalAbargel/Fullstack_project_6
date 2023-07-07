const express = require("express");
const router = express.Router();
const db = require('../database/db');

const bodyParser = require("body-parser");
router.use(bodyParser.json());





//GET TODOS
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
    const query = 'SELECT * FROM todos WHERE userId = ?';
    connection.query(query, [userId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.length === 0) {
          //404 - Todos not found
          console.log(results);
        return res.status(404).send('Todos not found');
      } else {
        res.status(200).json(results);
      }
    });
  });
});

//POST = create todo
router.post('/', (req, res) => {
  // Extract user data from the request body
  const {userId, title, completed} = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'INSERT INTO users (userId, title, completed) VALUES (?, ?)';
    connection.query(query, [userId, title, completed], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
      //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else {
      //201 - Todo created successfully
        res.status(201).json({ message: 'Todo created successfully' });
      }
    });
  });
});

//PUT = update
router.put('/', (req, res) => {
  // Retrieve user ID and updated data from request parameters and body
  const userId = req.params.id;
  const { name, email } = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
              //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    connection.query(query, [name, email, userId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
                //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.affectedRows === 0) {
          //404 - User not found
        return res.status(404).send('User not found');
      } else {
        res.json({ message: 'User updated successfully' });
      }
    });
  });
});

//Delete
router.delete('/', (req, res) => {
  // Retrieve user ID from request parameters
  const userId = req.params.id;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
          //500 - Internal server error

      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
                //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.affectedRows === 0) {
          //404 - User not found
        return res.status(404).send('User not found');
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    });
  });
});

module.exports = router;
