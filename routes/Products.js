const express = require("express");
const router = express.Router();
const db = require('../database/db');

// router.get("/", product.getAllProducts);
// router.get("/categories", product.getProductCategories);
// router.get("/category/:category", product.getProductsInCategory);
// router.get("/:id", product.getProduct);
// router.post("/", product.addProduct);
// router.put("/:id", product.editProduct);
// router.patch("/:id", product.editProduct);
// router.delete("/:id", product.deleteProduct);



const bodyParser = require("body-parser");
router.use(bodyParser.json());

// GET product by id
router.get('/:id', (req, res) => {
  // Retrieve product ID from request parameters
  const productId = req.params.id;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'SELECT * FROM products WHERE id = ?';
    connection.query(query, [productId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.length === 0) {
        //404 - Product not found
        return res.status(404).send('Product not found');
      } else {
        res.json(results[0]);
      }
    });
  });
});

//POST = create
router.post('/', (req, res) => {
  // Extract product data from the request body
  const { title, price, description, category, image, rating_rate, rating_count } = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'INSERT INTO products (title, price, description, category, image, rating_rate, rating_count) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [title, price, description, category, image, rating_rate, rating_count], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else {
        //201 - Product created successfully
        res.status(201).json({ message: 'Product created successfully' });
      }
    });
  });
});

//PUT = update
router.put('/:id', (req, res) => {
  // Retrieve product ID and updated data from request parameters and body
  const productId = req.params.id;
  const { title, price, description, category, image, rating_rate, rating_count } = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'UPDATE products SET title = ?, price = ?, description = ?, category = ?, image = ?, rating_rate = ?, rating_count = ? WHERE id = ?';
    connection.query(query, [title, price, description, category, image, rating_rate, rating_count, productId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.affectedRows === 0) {
        //404 - Product not found
        return res.status(404).send('Product not found');
      } else {
        res.json({ message: 'Product updated successfully' });
      }
    });
  });
});

//DELETE
router.delete('/:id', (req, res) => {
  // Retrieve product ID from request parameters
  const productId = req.params.id;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'DELETE FROM products WHERE id = ?';
    connection.query(query, [productId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.affectedRows === 0) {
        //404 - Product not found
        return res.status(404).send('Product not found');
      } else {
        res.json({ message: 'Product deleted successfully' });
      }
    });
  });
});

module.exports = router;

