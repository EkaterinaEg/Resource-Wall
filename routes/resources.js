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
      // let result = {};
      // for (const res of resources) {
      //   if (result[res.id]) {
      //     //if it exists
      //     result[res.id].push(res.category);
      //   } else {
      //     result[res.id] = [res.category];
      //   }
      // }
      //console.log("RD TEsting ", result);
      // const categories = getCategoriesbyResourse(resources.id);
      const templateVars = {
        resources,
      };

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
// Post request for search page
router.post("/search", (req, res) => {
  // if (!res.locals.userId) {
  //   return res.redirect("/login");
  // }
  resourceQueries
    .getResourcesbyCategoryRating(req.body)
    .then((resources) => {
      const templateVars = { resources };

      res.render("resources", templateVars);
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
  const user_id = 2;
  resourceQueries
    .getResourcesbyUser(user_id)
    .then((resources) => {
      const templateVars = {
        resources,
        user_id: user_id,
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

  Promise.all([
    resourceQueries.getCommentsByResourseId(resource_id),
    resourceQueries.getResourcebyResourceId(resource_id),
  ])
    .then(([comments, resources]) => {
      const templateVars = {
        resources: resources,
        comments: comments, // You can pass comments to the template here
        resource_id: resource_id,
      };

      res.render("single_page", templateVars);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});
//   resourceQueries
//     .getCommentsByResourseId(resource_id)
//     .then((comment) => {
//       return getResourcebyResourceId(resource_id);
//     })
//     .then((resources) => {
//       console.log(resources);
//       const templateVars = {
//         resources: resources,
//         resource_id: resource_id,
//       };

//       res.render("single_page", templateVars);
//     })
//     .catch((err) => {
//       res.status(500).send({ error: err.message });
//     });
// });

//POST request for changing rating
router.post("/rating/:resource_id", (req, res) => {
  const resource_id = req.params.resource_id;

  // console.log("resourceID ", resource_id);
  const rating = req.body.rating;
  const user_id = 1;
  // console.log("req.body: ", req.body);

  resourceQueries
    .updateRating(user_id, resource_id, rating)
    .then((resources) => {
      // const templateVars = {
      //   resources: resources,
      //   resource_id: resource_id,
      // };
      res.redirect(`/`);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

//POST request for adding category
router.post("/category/:resource_id", (req, res) => {
  const resource_id = req.params.resource_id;
  const user_id = 1;
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
  const user_id = 2;
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
  const user_id = 1;

  return resourceQueries
    .addComments(user_id, resource_id, req.body.comment)
    .then((comments) => {
      // res.render("single_page", templateVars);

      // return comments;
      res.redirect(`/resources/${resource_id}`);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

module.exports = router;
