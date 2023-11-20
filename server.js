// load .env data into process.env
require("dotenv").config();

// Web server config
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");

const PORT = process.env.PORT || 8080;
const app = express();

app.set("view engine", "ejs");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

// DELETE LATER
const userApiRoutes = require("./routes/users-api");
const widgetApiRoutes = require("./routes/widgets-api");
const usersRoutes = require("./routes/users");
//

const resourceRoutes = require("./routes/resources.js");
// const myResourcesRoutes = require("./routes/my_resources.js");
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/resources", resourceRoutes);
// app.use("/my_resources", resourceRoutes);
// app.use("/search", resourceRoutes);

// DELETE LATER
app.use("/api/users", userApiRoutes);
app.use("/api/widgets", widgetApiRoutes);
app.use("/users", usersRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/search", (req, res) => {
  res.render("search_page");
});
app.get("/my_resources", (req, res) => {
  res.render("my_resources");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
