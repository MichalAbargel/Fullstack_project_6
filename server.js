const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3500;
// Require the route files
//const homeRoutes = require("./routes/Home");
const usersRoutes = require("./routes/Users");
const productsRoutes = require("./routes/Products");
const cartsRoutes = require("./routes/Carts");
const loginRoutes = require("./routes/Login");
const registersRoutes = require("./routes/Register");

app.use(cors());

// use the route files
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
//app.use("/api/home", homeRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/register", registersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});