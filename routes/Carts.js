const express = require("express");
const router = express.Router();
const db = require('../database/db');

// router.get('/',cart.getAllCarts)
// router.get('/:id',cart.getSingleCart)
// router.get('/user/:userid',cart.getCartsbyUserid)

// router.post('/',cart.addCart)
// //router.post('/:id',cart.addtoCart)

// router.put('/:id',cart.editCart)
// router.patch('/:id',cart.editCart)
// router.delete('/:id',cart.deleteCart)



const bodyParser = require("body-parser");
router.use(bodyParser.json());

// POST create cart for user
router.post('/', (req, res) => {
  // Extract user data from the request body
  const { userId, date, status } = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      // 500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'INSERT INTO carts (userId, date, status) VALUES (?, ?, ?)';
    connection.query(query, [userId, date, status], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        // 500 - Internal server error
        return res.status(500).send('An error occurred');
      } else {
        // 201 - Cart created successfully
        res.status(201).json({ message: 'Cart created successfully' });
      }
    });
  });
});

// GET cart by user id
router.get('/:userId', (req, res) => {
  // Retrieve user ID from request parameters
  const userId = req.params.userId;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      // 500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'SELECT * FROM carts WHERE userId = ?';
    connection.query(query, [userId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        // 500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.length === 0) {
        // 404 - Cart not found
        return res.status(404).send('Cart not found');
      } else {
        res.json(results[0]);
      }
    });
  });
});

// PUT update cart status by user id
router.put('/:userId', (req, res) => {
  // Retrieve user ID and updated data from request parameters and body
  const userId = req.params.userId;
  const { status } = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      // 500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'UPDATE carts SET status = ? WHERE userId = ?';
    connection.query(query, [status, userId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        // 500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.affectedRows === 0) {
        // 404 - Cart not found
        return res.status(404).send('Cart not found');
      } else {
        res.json({ message: 'Cart updated successfully' });
      }
    });
  });
});

// DELETE cart by user id
router.delete('/:userId', (req, res) => {
  // Retrieve user ID from request parameters
  const userId = req.params.userId;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      // 500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'DELETE FROM carts WHERE userId = ?';
    connection.query(query, [userId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        // 500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.affectedRows === 0) {
        // 404 - Cart not found
        return res.status(404).send('Cart not found');
      } else {
        res.json({ message: 'Cart deleted successfully' });
      }
    });
  });
});


module.exports = router