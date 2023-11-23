const db = require("../connection");

const getResources = () => {
  return db
    .query(
      "SELECT resources.*, ROUND(AVG(resource_ratings.rating),0) AS rating, STRING_AGG(DISTINCT categories.name, ', ') AS category FROM resources LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id LEFT JOIN categories ON resource_categories.category_id = categories.id LEFT JOIN resource_ratings ON resources.id = resource_ratings.resource_id GROUP BY resources.id;"
    )
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Get resources by search from search page
const getResourcesbyCategoryRating = (options) => {
  const queryParams = [];

  let queryString = `SELECT resources.*, ROUND(AVG(resource_ratings.rating),0) AS rating, STRING_AGG(DISTINCT categories.name, ', ') AS category
  FROM resources
  LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
  LEFT JOIN categories ON resource_categories.category_id = categories.id
  LEFT JOIN resource_ratings ON resources.id = resource_ratings.resource_id `;

  if (options.category) {
    queryParams.push(`%${options.category.toLowerCase()}%`);
    queryString += `WHERE categories.name LIKE $${queryParams.length} `;
  }

  queryString += `
  GROUP BY resources.id
  `;
  if (options.rating) {
    queryParams.push(Number(options.rating.toLowerCase()));
    queryString += `HAVING ROUND(AVG(resource_ratings.rating),0) > $${queryParams.length};`;
  }
  return db
    .query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getResourcesbyUser = (user_id) => {
  return db
    .query(
      `SELECT ROUND(AVG(resource_ratings.rating),0) AS rating, STRING_AGG(DISTINCT categories.name, ', ') AS category, users.*, resources.*
      FROM resources
      LEFT JOIN favourite_resources ON resources.id = favourite_resources.resource_id
      LEFT JOIN resource_ratings ON resources.id = resource_ratings.resource_id
      LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
      LEFT JOIN categories ON resource_categories.category_id = categories.id
      LEFT JOIN users ON resources.user_id = users.id
      WHERE resources.user_id = ${user_id} OR favourite_resources.user_id = ${user_id}
      GROUP BY resources.id, users.id;`
    )
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getResourcebyResourceId = (resource_id) => {
  return db
    .query(
      `SELECT resources.*, resources.id AS resourceIdOriginal, ROUND(AVG(resource_ratings.rating),0) AS rating, STRING_AGG(DISTINCT categories.name, ', ') AS category, creator_resource.name AS creator_resource, resource_comments.*, comment_creator.name AS comment_creator_name
      FROM resources
      FULL OUTER JOIN users ON users.id = resources.user_id
      LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id
      LEFT JOIN categories ON resource_categories.category_id = categories.id
      LEFT JOIN resource_ratings ON resources.id = resource_ratings.resource_id
      LEFT JOIN resource_comments ON resources.id = resource_comments.resource_id
      LEFT JOIN users AS comment_creator ON resource_comments.user_id = comment_creator.id
      LEFT JOIN users AS creator_resource ON resources.user_id = creator_resource.id
      WHERE resources.id = ${resource_id}
      GROUP BY resources.id, users.id, resource_comments.id, comment_creator.name, creator_resource.name;`
    )
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// UPDATE description, title, link for resources
const updateResourceTable = (resource_id, description, title, link) => {
  const queryParams = [resource_id, description, title, link];
  let queryString = `UPDATE resources
  SET description = $1, title = $2, link = $3
  WHERE condition resources.resource_id = ${resource_id};
  `;

  return db
    .query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const findCategoryID = (name) => {
  return db
    .query(`SELECT id FROM categories WHERE categories.name = $1;`, [name])
    .then((data) => {
      return data.rows[0].id;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

//Add category to resource
const addCategory = (resource_id, category_id) => {
  const queryParams = [resource_id, category_id];
  let queryString = `INSERT INTO resource_categories(resource_id, category_id)
  VALUES($1, $2) RETURNING *;`;

  return db
    .query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// Update rating for resource
const updateRating = (user_id, resource_id, rating) => {
  const queryParams = [user_id, resource_id, rating];
  let queryString = `INSERT INTO resource_ratings(user_id, resource_id, rating)
  VALUES($1, $2, $3) RETURNING *;`;

  return db
    .query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
//Add comments
const addComments = (user_id, resource_id, comment) => {
  const queryParams = [user_id, resource_id, comment];
  let queryString = `INSERT INTO resource_comments(user_id, resource_id, comment)
  VALUES($1, $2, $3) RETURNING *;`;

  return db
    .query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getCommentsByResourseId = (resource_id) => {
  return db
    .query(
      `SELECT resource_comments.*, users.name AS comment_creator_name
    FROM resource_comments
    LEFT JOIN users ON resource_comments.user_id = users.id
    WHERE resource_comments.resource_id = ${resource_id}
    GROUP BY resource_comments.resource_id, resource_comments.id, users.name;`
    )
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Add resource to favourite table
const addLike = (user_id, resource_id) => {
  const queryParams = [user_id, resource_id];
  let queryString = `INSERT INTO favourite_resources(user_id, resource_id)
  VALUES($1, $2) RETURNING *;`;

  return db
    .query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// adding a new resource
const addResource = function (resource, user_id) {
  let queryParams = [];
  queryParams.push(user_id);
  for (const val in resource) {
    queryParams.push(resource[val]);
  }
  let query = `INSERT INTO resources (user_id, link, title, description)
  VALUES ($1, $2, $3, $4);`;
  console.log(query);
  console.log(queryParams);
  return db
    .query(query, queryParams)
    .then(() => {
      return console.log("inserted new resource");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getResources,

  getResourcesbyCategoryRating,
  getResourcesbyUser,
  getResourcebyResourceId,
  updateResourceTable,
  updateRating,
  addComments,
  findCategoryID,
  addCategory,
  addLike,
  getCommentsByResourseId,
  addResource,
};
