const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());

//login
router.get("/:username", async (req, res) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users?username=${req.params.username}`
  );
  const data = await response.json();
  // add login check in the server?
  res.send(data);
});

// POST user
router.post("/", (req, res) => {
  const user = {
    id: 1, // TODO id from DB
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    website: req.body.website,
    company: req.body.company,
  };

  // check if user alrady exist in DB -> if true return?
  // add user to DB

  res.send(user);
});

module.exports = router;
