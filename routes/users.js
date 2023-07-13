const express = require("express");
const router = express.Router();
const db = require('../database/db');

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// GET user by username
router.get('/:username', (req, res) => {
  // Retrieve user ID from request parameters
  const username = req.params.username;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.length === 0) {
          //404 - User not found
        return res.status(404).send('User not found');
      } else {
        res.json(results[0]);
      }
    });
  });
});

// GET user by id
router.get('/:id', (req, res) => {
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
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.length === 0) {
          //404 - User not found
        return res.status(404).send('User not found');
      } else {
        res.json(results[0]);
      }
    });
  });
});

//POST = create
router.post('/', (req, res) => {
  // Extract user data from the request body
  const { name, username, email, phone,website } = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'INSERT INTO users (name, username, email, phone, website) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [ name, username, email, phone, website], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
      //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else {
      //201 - User created successfully
        res.status(201).json({ message: 'User created successfully' });
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
