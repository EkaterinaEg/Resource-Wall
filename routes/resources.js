/*
 * All routes for resources Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const db = require("../db/connection");
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

// GET /resources Home page
router.get("/", (req, res) => {
  resourceQueries
    .getResources()
    .then((resources) => {
      const templateVars = { resources };

      res.render("resources", templateVars);
    })

    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

// Search main page by category
router.post("/", (req, res) => {
  resourceQueries
    .getResourcesbyCategory(req.body.category)
    .then((resources) => {
      const templateVars = { resources };

      res.render("resources", templateVars);
    })

    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});
// GET search page from nav menu
router.get("/search", (req, res) => {
  // if (!res.locals.userId) {
  //   return res.redirect("/login");
  // }
  res.render("search_page");
});

router.post("/search", (req, res) => {
  // if (!res.locals.userId) {
  //   return res.redirect("/login");
  // }
  resourceQueries
    .getResourcesbyCategoryRating(req.body)
    .then((resources) => {
      const templateVars = { resources };

      res.render("search_from_main", templateVars);
    })

    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

router.get("/my_resources", (req, res) => {
  // if (!res.locals.userId) {
  //   return res.redirect("/login");
  // }
  // const userId = req.session.userId;
  // resourceQueries
  //   .getUserResources(userId)
  //   .then((resources) => {
  //     const templateVars = { resources };

  res.render("my_resources", templateVars);
});

// .catch((err) => {
//   res.status(500).send({ error: err.message });
// });
// });

router.get('/login/:id', (req ,res) => {
  req.session.user_id = req.params.id
  res.redirect('/')
});

// GET /new
router.get('/new', (req, res) => {
  console.log(req.session.user_id)
  const user_id1 = res.locals.userId;
  const user_id = req.session.user_id;
  if (!user_id1) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }
  res.render("new_resource");
});


// POST /new
router.post("/new", (req, res) => {
  const user_id1 = res.locals.userId;
  const user_id = req.session.user_id;
  if (!user_id1) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }
console.log(req.body)
console.log('1:', user_id)
console.log('2:', user_id1)
  const newResource = req.body;
    resourceQueries
    .addResource(newResource, user_id1)
    .then(() => {
      res.redirect('/search');
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

module.exports = router;
