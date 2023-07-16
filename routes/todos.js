const express = require("express");
const router = express.Router();
const db = require("../database/db");

const bodyParser = require("body-parser");
router.use(bodyParser.json());

//GET TODOS
router.get("/:userid", async (req, res) => {
  console.log("handle GET req in todos");

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
    const query = "SELECT * FROM todos WHERE userId = ?";
    connection.query(query, [userId], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.length === 0) {
        //404 - Todos not found
        console.log(results);
        return res.status(404).send("Todos not found");
      } else {
        res.status(200).json(results);
      }
    });
  });
});

//POST = create todo
router.post("/", (req, res) => {
  console.log("handle POST req in todos");

  // Extract user data from the request body
  const { userId, title, completed } = req.body;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query =
      "INSERT INTO todos (userId, title, completed) VALUES (?, ?, ?)";
    connection.query(query, [userId, title, completed], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else {
        //201 - Todo created successfully
        res.status(201).json({ message: "Todo created successfully" });
      }
    });
  });
});

//PUT = update
router.put("/", (req, res) => {
  console.log("handle PUT req in todos");

  // Retrieve user ID and updated data from request parameters and body
  const todoId=req.body.id;
  const title= req.body.title;
  const completed= req.body.completed;
console.log("TodoId: "+todoId+"\ntitle: "+title+"\ncomplete: "+completed);
  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "UPDATE todos SET title = ?, completed = ? WHERE id = ?";
    connection.query(query, [title, completed, todoId], (err, results) => {
      connection.release();
      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.affectedRows === 0) {
        //404 - Task not found
        return res.status(404).send("Task not found");
      } else {
        res.status(200).json({ message: "Task updated successfully"});
      }
    });
  });
});

//Delete todo
router.delete("/:todoId", (req, res) => {
  console.log("handle DELETE req in todos");

  // Retrieve user ID from request parameters
  const todoId = req.params.todoId;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error

      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "DELETE FROM todos WHERE id = ?";
    connection.query(query, [todoId], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.affectedRows === 0) {
        //404 - User not found
        return res.status(404).send("User not found");
      } else {
        res.status(200).json({ message: "User deleted successfully" });
      }
    });
  });
});

module.exports = router;
