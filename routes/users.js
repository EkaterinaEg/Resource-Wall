/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries/users");
const bcrypt = require("bcryptjs");

router.get("/users/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  console.log(user_id);
  userQueries
    .getUserById(user_id)
    .then((users) => {
      console.log("users", users);
      const templateVars = {
        users: users,
        user_id: users.id,
      };

      res.render("users", templateVars);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

router.post("/users/:user_id", (req, res) => {
  const user_id = req.session.user_id;
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  userQueries
    .updateUsers(name, email, hashedPassword, user_id)
    .then((users) => {
      res.redirect(`/my_resources`);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

module.exports = router;
