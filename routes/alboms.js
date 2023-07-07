const express = require("express");
const router = express.Router();
const db = require('../database/db');

const bodyParser = require("body-parser");
router.use(bodyParser.json());

//בסיס הנתונים  חסר את הנתונים האלה, נחזור לזה בהמשך


//GET user's alboms
router.get("/:userid", async (req, res) => {

  // Retrieve user ID from request parameters
  const userId = req.params.userid;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      //500 - Internal server error
      return res.status(500).send('An error occurred');
    }

    // Prepare and execute the SQL query
    const query = 'SELECT * FROM albums WHERE userId = ?';
    connection.query(query, [userId], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        //500 - Internal server error
        return res.status(500).send('An error occurred');
      } else if (results.length === 0) {
          //404 - User's posts not found
        return res.status(404).send("User's posts not found");
      } else {
        //200- ok
        res.status(200).json(results);
      }
    });
  });
});

// router.get("/:userid", async (req, res) => {
//   const response = await fetch(
//     `https://jsonplaceholder.typicode.com/albums/?userId=${req.params.userid}`
//   );

//   const data = await response.json();
//   console.log(data);
//   res.send(data);
// });

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
