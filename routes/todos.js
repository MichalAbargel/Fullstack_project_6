const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());

//GET TODOS
router.get("/:userid", async (req, res) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/?userId=${req.params.userid}`
  );

  const data = await response.json();
  console.log(data);
  res.send(data);
});

// POST todo
router.post("/", (req, res) => {
  const todo = {
    id: 1, // TODO id from DB
    userId: req.body.userId,
    title: req.body.title,
    completed: req.body.completed,
  };
  // add todo to DB

  res.send(todo);
});

module.exports = router;
