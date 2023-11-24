const express = require("express");
const router = express.Router();
const resourceQueries = require("../db/queries/resources");
const cookieSession = require("cookie-session");
router.use(
  cookieSession({
    name: "session",
    keys: ["fasdklfhaklsdhfklas"],
  })
);
//Middleware
router.use((req, res, next) => {
  // Assuming `req.session.user_id` holds the user's session ID
  res.locals.userId = req.session.user_id;
  next(); // Continue to the next middleware or route handler
});

// GET /new
router.get("/", (req, res) => {
  const user_id1 = res.locals.userId;
  const user_id = req.session.user_id;
  if (!user_id1) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }
  res.render("new_resource");
});

// POST /new
router.post("/", (req, res) => {
  const user_id1 = res.locals.userId;
  const user_id = req.session.user_id;
  if (!user_id1) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }
  const newResource = req.body;
  resourceQueries
    .addResource(newResource, user_id1)
    .then((response) => {
      res.redirect("/search");
    })
    .catch((e) => {
      res.send(e);
    });
});

module.exports = router;
