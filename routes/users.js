
const express = require("express");
const router = express.Router();
const db = require('../database/db');

// router.get('/',user.getAllUser)
// router.get('/:id',user.getUser)
// router.post('/',user.addUser)
// router.put('/:id',user.editUser)
// router.patch('/:id',user.editUser)
// router.delete('/:id',user.deleteUser)


const bodyParser = require("body-parser");
router.use(bodyParser.json());

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
  const {
    name: { firstname, lastname },
    email,
    phone,
    address: { city, street, number, zipcode, geolocation },
  } = req.body;

  // Extract geolocation data
  const { lat, long } = geolocation;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query =
      'INSERT INTO users (name.firstname, name.lastname, email, phone, address.city, address.street, address.number, address.zipcode, address.geolocation.lat, address.geolocation.long) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(
      query,
      [firstname, lastname, email, phone, city, street, number, zipcode, lat, long],
      (err, results) => {
        connection.release();

        if (err) {
          console.error('Error executing query:', err);
          //500 - Internal server error
          return res.status(500).send('An error occurred');
        } else {
          //201 - User created successfully
          res.status(201).json({ message: 'User created successfully' });
        }
      }
    );
  });
});

//PUT = update
router.put('/:id', (req, res) => {
  // Retrieve user ID and updated data from request parameters and body
  const userId = req.params.id;
  const {
    name: { firstname, lastname },
    email,
    address: { city, street, number, zipcode, geolocation },
  } = req.body;

  // Extract geolocation data
  const { lat, long } = geolocation;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query =
      'UPDATE users SET name.firstname = ?, name.lastname = ?, email = ?, address.city = ?, address.street = ?, address.number = ?, address.zipcode = ?, address.geolocation.lat = ?, address.geolocation.long = ? WHERE id = ?';
    connection.query(
      query,
      [firstname, lastname, email, city, street, number, zipcode, lat, long, userId],
      (err, results) => {
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
      }
    );
  });
});

//DELETE
router.delete('/:id', (req, res) => {
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
