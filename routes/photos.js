const express = require("express");
const router = express.Router();
const db = require('../database/db');
//בסיס הנתונים  חסר את הנתונים האלה, נחזור לזה בהמשך

const bodyParser = require("body-parser");
router.use(bodyParser.json());

//GET photos
router.get("/:albumId", async (req, res) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/photos?albumId=${req.params.albumId}&_limit=${req.query.limit}&_start=${req.query.start}`
  );

  const data = await response.json();
  console.log(data);
  res.send(data);
});

// POST photo
router.post("/", (req, res) => {
  const photo = {
    id: 1, // TODO id from DB
    albumId: req.body.albumId,
    url: req.body.url, // set url of image - need to send an image?
    thumbnailUrl: req.body.thumbnailUrl, // set thumbnailUrl of image - need to send an image?
  };

  // add photo to DB

  res.send(photo);
});

module.exports = router;
