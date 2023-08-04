const express = require("express");
const router = express.Router();

const app = express();

// Require the route files
const homeRoutes = require("./routes/Home");
const usersRoutes = require("./routes/Users");
const productsRoutes = require("./routes/Products");
const cartsRoutes = require("./routes/Carts");
const loginRoutes = require("./routes/Login");
const registersRoutes = require("./routes/Register");

app.use(cors());

// use the route files
app.use("/api/home", homeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/register", registersRoutes);

app.listen(3500, () => {
  console.log("server run");
});

app.get("/", (req, res) => {
  res.send("hello");
});
