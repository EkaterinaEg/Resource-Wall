const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const resourceQueries = require("../db/queries/resources");
const userQueries = require("../db/queries/users");

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
  const user_id = req.session.user_id;
  Promise.all([
    userQueries.getUserById(user_id),
    resourceQueries.getResources(),
  ])
    .then(([user,resources]) => {
      const templateVars = {
        resources,
        user
      };

      res.render("resources", templateVars);
    })

    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

// GET search page from nav menu
router.get("/search", (req, res) => {
  const user_id = req.session.user_id;
  userQueries.getUserById(user_id)
  .then((user) => {
    const templateVars = { user }
    res.render("search_page",templateVars);
  })
});

// Post request for search page
router.post("/search", (req, res) => {
  const user_id = req.session.user_id;
  Promise.all([
    resourceQueries.getResourcesbyCategoryRating(req.body),
    userQueries.getUserById(user_id),
  ])
    .then(([resources, user]) => {
      const templateVars = { 
        resources, 
        user 
      };
      res.render("resources", templateVars);
    })

    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

// GET to my resources
router.get("/my_resources", (req, res) => {
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }

  Promise.all([
    userQueries.getUserById(user_id),
    resourceQueries.getResourcesbyUser(user_id),
  ])
    .then(([user, resources]) => {
      const templateVars = {
        resources,
        user,
        user_id
      };

      res.render("my_resources", templateVars);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

//GET request for single resource page
router.get("/resources/:resource_id", (req, res) => {
  const resource_id = req.params.resource_id;
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }

  Promise.all([
    resourceQueries.getCommentsByResourseId(resource_id),
    resourceQueries.getResourcebyResourceId(resource_id),
    userQueries.getUserById(user_id),
  ])
    .then(([comments, resources, user]) => {
      const templateVars = {
        resources: resources,
        comments: comments,
        resource_id: resource_id,
        user
      };

      res.render("single_page", templateVars);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

//POST request for changing rating
router.post("/rating/:resource_id", (req, res) => {
  const resource_id = req.params.resource_id;
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }

  const rating = req.body.rating;

  resourceQueries
    .updateRating(user_id, resource_id, rating)
    .then((resources) => {
      res.redirect(`/`);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

//POST request for adding category
router.post("/category/:resource_id", (req, res) => {
  const resource_id = req.params.resource_id;
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }

  return resourceQueries
    .findCategoryID(req.body.category)
    .then((category_id) => {
      return resourceQueries.addCategory(resource_id, category_id);
    })
    .then((resources) => {
      res.redirect(`/`);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

//POST request for adding like(to favourite)
router.post("/like/:resource_id", (req, res) => {
  const resource_id = req.params.resource_id;
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }

  return resourceQueries
    .addLike(user_id, resource_id)
    .then((data) => {
      res.redirect(`/my_resources`);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

//POST request for adding comment
router.post("/comment/:resource_id", (req, res) => {
  const resource_id = req.params.resource_id;
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }

  return resourceQueries
    .addComments(user_id, resource_id, req.body.comment)
    .then((comments) => {
      res.redirect(`/resources/${resource_id}`);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

router.get("/login/:id", (req, res) => {
  req.session.user_id = req.params.id;
  res.redirect("/");
});

// GET /new
router.get("/new", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }
  userQueries.getUserById(user_id)
  .then((user) => {
    const templateVars = { user }
    res.render("new_resource", templateVars);
  })
});

// POST /new
router.post("/new", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.send({ error: "Sorry you must be logged in to add a resource" });
  }

  const newResource = req.body;
  resourceQueries
    .addResource(newResource, user_id)
    .then(() => {
      res.redirect("/my_resources");
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

// // clears cookie when you logout
// router.post("/logout", (req, res) => {
  
//   req.session = null;
  
//   res.redirect("/")
// });


module.exports = router;
