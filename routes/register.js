const express = require("express");
const router = express.Router();
const db = require("../database/db");

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// POST register (add user)
router.post("/", (req, res) => {
  const { name, email, phone, address, username, password } = req.body;

  try {
    const check = isUserWithEmailExists(email);
    if (check) {
      // Email is already exists
      console.log("\n" + results.length + "\n" + results[0] + "\n");
      return res.status(409).send("Email is already taken.");
    }
    check = isPasswordWithUsernameExists(username);
    if (check) {
      // Username is already exists
      console.log("\n" + results.length + "\n" + results[0] + "\n");
      return res.status(409).send("Username is already taken.");
    }
    // Add a new user to the database
    const insertUser = addUser(name, email, phone, address);
    // Username does not exist, add the user's password
    if (insertUser) {
      if (addPassword(insertUser.id, username, password)) {
        console.log("\nAdd user and password.\n" + insertUser);
        return res.status(201).json(userData);
      }
      //delete the insert date?
    }
  } catch (err) {
    console.error("Error executing query:", err);
    return res.status(500).send("An error occurred");
  }
});

//check if user with this email is exist
async function isUserWithEmailExists(email) {
  try {
    const connection = await db.getConnection();
    const query = "SELECT COUNT(*) as count FROM users WHERE email = ?";
    const result = await connection.query(query, [email]);
    connection.release();

    const count = result[0].count;
    return count > 0;
  } catch (err) {
    console.error("Error checking user existence:", err);
    throw err;
  }
}

//check if user with this email is exist
async function isPasswordWithUsernameExists(username) {
  try {
    const connection = await db.getConnection();
    const query = "SELECT COUNT(*) as count FROM passwords WHERE username = ?";
    const result = await connection.query(query, [username]);
    connection.release();

    const count = result[0].count;
    return count > 0;
  } catch (err) {
    console.error("Error checking username existence:", err);
    throw err;
  }
}

// Add a new user to the database
async function addUser(name, email, phone, address) {
  try {
    //  const apiKey = generateUniqueKey();
    const connection = await db.getConnection();
    const query =
      "INSERT INTO users (name.firstname, name.lastname, email, phone, address.city, address.street,address.number, address.zipcode,address.geolocation.lat,address.geolocation.long)VALUES (?, ?, ?, ?, ?, ?,?,?,?,?)";
    const result = await connection.query(query, [
      name.firstname,
      name.lastname,
      email,
      phone,
      address.city,
      address.street,
      address.number,
      address.zipcode,
      address.geolocation.lat,
      address.geolocation.long,
    ]);
    connection.release();
    console.log("success addition user.");
    return result;
  } catch (err) {
    console.error("Error adding user:", err);
    throw err;
  }
}

async function addPassword(userId, username, password) {
  try {
    const connection = await db.getConnection();
    const query =
      "INSERT INTO passwords (userId,username, password) VALUES (?, ?,?)";
    await connection.query(query, [userId, username, password]);
    connection.release();
    return true;
  } catch (err) {
    console.error("Error adding password:", err);
    throw err;
  }
}

async function getDetails(username) {
  try {
    const connection = await db.getConnection();
    const query = "SELECT * FROM users WHERE username = ?";
    const results = await connection.query(query, username);
    connection.release();

    if (results.length === 0) {
      throw new Error("Invalid username");
    }

    return results[0];
  } catch (err) {
    console.error("Error getting user details:", err);
    throw err;
  }
}

// Create API key
const generateUniqueKey = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const keyLength = 20;
  let apiKey = "";

  for (let i = 0; i < keyLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters[randomIndex];
  }

  return apiKey;
};

module.exports = router;
