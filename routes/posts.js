const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// GET all posts
router.get("/", async (req, res) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
  const data = await response.json();
  //console.log(data);
  res.send(data);
});

// GET all posts of user
router.get("/:userid", async (req, res) => {
  const userid = req.params.userid;

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/?userId=${userid}`
  );
  const data = await response.json();
  //console.log(data);
  res.send(data);
});

// GET post by id and userid
router.get("/:userid/:postid", async (req, res) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/?userId=${req.params.userid}&id=${req.params.postid}`
  );
  const data = await response.json();
  //console.log(data);
  res.send(data);
});

// POST add post
router.post("/", (req, res) => {
  console.log("handle post req");
  console.log(req.body);
  const post = {
    id: 1, // TODO id from DB
    userId: req.body.userid,
    title: req.body.title,
    body: req.body.body,
  };
  // need add post to DB
  console.log(post);
  res.status(200); //set ok
  res.send(post);
});

module.exports = router;
