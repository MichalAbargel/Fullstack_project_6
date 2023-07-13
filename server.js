const express = require("express");
const cors = require("cors");

const app = express();

// Require the route files
const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");
const photosRoutes = require("./routes/photos");
const albomsRoutes = require("./routes/alboms");
const todosRoutes = require("./routes/todos");
const loginRoutes = require("./routes/login");
const registersRoutes = require("./routes/register");

app.use(cors());

// use the route files
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/photos", photosRoutes);
app.use("/api/alboms", albomsRoutes);
app.use("/api/todos", todosRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/register", registersRoutes);

app.listen(3500, () => {
  console.log("server run");
});

app.get("/", (req, res) => {
  res.send("hello");
});
