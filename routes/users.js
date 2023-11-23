/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries/users");

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
  const user_id = req.params.user_id;
  const { name, email, password } = req.body;

  console.log(user_id);
  console.log(name, email, password);
  userQueries
    .updateUsers(user_id, req.body)
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

module.exports = router;
