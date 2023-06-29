const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());

//GET alboms
router.get("/:userid", async (req, res) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/albums/?userId=${req.params.userid}`
  );

  const data = await response.json();
  console.log(data);
  res.send(data);
});

//POST albom
router.post("/", (req, res) => {
  const albom = {
    id: 1, // TODO id from DB
    userId: req.body.userId,
    title: req.body.title,
  };

  // add albom to DB

  res.send(albom);
});

module.exports = router;
