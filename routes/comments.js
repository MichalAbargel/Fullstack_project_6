const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// GET comments
router.get("/:userid/:postid", async (req, res) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments/?userId=${req.params.userid}&postId=${req.params.postid}`
  );

  const data = await response.json();
  console.log(data);
  res.send(data);
});

//POST comment
router.post("/", (req, res) => {
  const comment = {
    id: 1, // TODO id from DB
    postId: req.body.postId,
    name: req.body.name,
    email: req.body.email,
    body: req.body.body,
  };

  // add comment to DB

  res.send(comment);
});

module.exports = router;
