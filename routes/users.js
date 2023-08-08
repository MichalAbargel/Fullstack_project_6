const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../database/db");
const fs = require('fs');

const upload = multer({ dest: "uploads/" }); // התמונה תתרחק במיקום זמני עד להעלאה למסד הנתונים
const imageStoragePath = '/path/to/image/storage/profiles';
// router.get('/',user.getAllUser)
// router.get('/:id',user.getUser)
// router.post('/',user.addUser)
// router.put('/:id',user.editUser)
// router.patch('/:id',user.editUser)
// router.delete('/:id',user.deleteUser)

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// GET user by id
router.get("/:id", (req, res) => {
  // Retrieve user ID from request parameters
  const userId = req.params.id;
  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "SELECT * FROM users WHERE id = ?";
    connection.query(query, [userId], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.length === 0) {
        //404 - User not found
        return res.status(404).send("User not found");
      } else {
        console.log(results[0]);
        res.json(results[0]);
      }
    });
  });
});

//POST = create
router.post("/", (req, res) => {
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
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query =
      "INSERT INTO users (name.firstname, name.lastname, email, phone, address.city, address.street, address.number, address.zipcode, address.geolocation.lat, address.geolocation.long) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(
      query,
      [
        firstname,
        lastname,
        email,
        phone,
        city,
        street,
        number,
        zipcode,
        lat,
        long,
      ],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query:", err);
          //500 - Internal server error
          return res.status(500).send("An error occurred");
        } else {
          //201 - User created successfully
          res.status(201).json({ message: "User created successfully" });
        }
      }
    );
  });
});

//PUT = update
router.put("/:id", (req, res) => {
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
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query =
      "UPDATE users SET name.firstname = ?, name.lastname = ?, email = ?, address.city = ?, address.street = ?, address.number = ?, address.zipcode = ?, address.geolocation.lat = ?, address.geolocation.long = ? WHERE id = ?";
    connection.query(
      query,
      [
        firstname,
        lastname,
        email,
        city,
        street,
        number,
        zipcode,
        lat,
        long,
        userId,
      ],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query:", err);
          //500 - Internal server error
          return res.status(500).send("An error occurred");
        } else if (results.affectedRows === 0) {
          //404 - User not found
          return res.status(404).send("User not found");
        } else {
          res.json({ message: "User updated successfully" });
        }
      }
    );
  });
});

//DELETE
router.delete("/:id", (req, res) => {
  // Retrieve user ID from request parameters
  const userId = req.params.id;

  // Connect to the database
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      //500 - Internal server error
      return res.status(500).send("An error occurred");
    }

    // Prepare and execute the SQL query
    const query = "DELETE FROM users WHERE id = ?";
    connection.query(query, [userId], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query:", err);
        //500 - Internal server error
        return res.status(500).send("An error occurred");
      } else if (results.affectedRows === 0) {
        //404 - User not found
        return res.status(404).send("User not found");
      } else {
        res.json({ message: "User deleted successfully" });
      }
    });
  });
});

// מעדכן ערך יחיד בתוך רשומה באמצעות PATCH
router.patch("/:id/uploadimg",  upload.single("image"), (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).json({ error: "חסר מזהה משתמש" });
    console.log("חסר מזהה משתמש");
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: "לא נבחרה תמונה להעלאה" });
    console.log("לא נבחרה תמונה להעלאה");
    return;
  }

  // בדיקה שהקובץ הוא תמונה
  if (!req.file.mimetype.startsWith("image/")) {
    res.status(400).json({ error: "הקובץ הנבחר אינו תמונה" });
    console.log("הקובץ הנבחר אינו תמונה");
    return;
  }

  // כאן אתה יכול לבצע את הפעולות שלך עם התמונה
  // נניח שאתה רוצה לשמור את התמונה במסד הנתונים כ- BLOB

  // קריאת קובץ התמונה
  const imageFile = req.file.path;

  // המרה לנתונים טובים להעלאה למסד הנתונים
  const imageBlob = fs.readFileSync(imageFile);

  const imagePath = `${imageStoragePath}/user${userId}`;
//save into file system
  saveImageToDisk(imageBlob, imagePath);
  // שליחה למסד הנתונים
  const query = "UPDATE users SET profile_picture = ? WHERE id = ?";
  db.query(query, [imagePath, userId], (err, result) => {
    if (err) {
      console.error("שגיאה בעדכון תמונת הפרופיל:", err);
      res.status(500).json({ error: "שגיאה בעדכון תמונת הפרופיל" });
      return;
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }
    console.log("התמונה עודכנה בהצלחה" );
    res.status(200).send(imageBlob);
  });});


// function updateUserImage(userId, imagePath) {
//   const query = "UPDATE users SET profile_picture = ? WHERE id = ?";
//   db.query(query, [imagePath, userId], (err, result) => {
//     if (err) {
//       console.error("שגיאה בעדכון תמונת הפרופיל:", err);
//       res.status(500).json({ error: "שגיאה בעדכון תמונת הפרופיל" });
//       return;
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "משתמש לא נמצא" });
//     }
//     console.log("התמונה עודכנה בהצלחה" );
//     res.status(200).json({ success: "התמונה עודכנה בהצלחה" });
//   });
// }

// הפונקציה מקבלת את הקובץ של התמונה כ-BLOB ואת השם שבו תשמר התמונה בשרת.
function saveImageToDisk(imageBlob, imagePath) {
  
  fs.writeFileSync(imagePath, imageBlob, 'binary');

  console.log('התמונה נשמרה בהצלחה:', imagePath);
}

function createSubdirectoryIfNotExists(directoryPath) {
  try {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
      console.log(`נתיב ${directoryPath} נוצר בהצלחה.`);
    } else {
      console.log(`נתיב ${directoryPath} כבר קיים.`);
    }
  } catch (err) {
    console.error(`אירעה שגיאה ביצירת נתיב ${directoryPath}:`, err);
  }
}

module.exports = router;
