const db = require("../connection");

const getResources = () => {
  return db
    .query(
      "SELECT resources.*, ROUND(AVG(resource_ratings.rating),0) AS rating, STRING_AGG(DISTINCT categories.name, ', ') AS category FROM resources LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id LEFT JOIN categories ON resource_categories.category_id = categories.id LEFT JOIN resource_ratings ON resources.id = resource_ratings.resource_id GROUP BY resources.id;"
    )
    .then((data) => {
      console.log(data.rows);
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Get resources by search from main page
const getResourcesbyCategory = (category) => {
  return db
    .query("SELECT * FROM resources WHERE resourses.category = category;")
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

  let queryString = `SELECT resources.*, ROUND(AVG(resource_ratings.rating),0) AS rating, STRING_AGG(DISTINCT categories.name, ', ') AS category FROM resources LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id LEFT JOIN categories ON resource_categories.category_id = categories.id LEFT JOIN resource_ratings ON resources.id = resource_ratings.resource_id `;

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
      `SELECT resources.*, ROUND(AVG(resource_ratings.rating),0) AS rating, STRING_AGG(DISTINCT categories.name, ', ') AS category, users.* FROM resources FULL OUTER JOIN users ON users.id = resources.user_id LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id LEFT JOIN categories ON resource_categories.category_id = categories.id LEFT JOIN resource_ratings ON resources.id = resource_ratings.resource_id WHERE resources.user_id = ${user_id} GROUP BY users.id, resources.id;`
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
      `SELECT resources.*, ROUND(AVG(resource_ratings.rating),0) AS rating, STRING_AGG(DISTINCT categories.name, ', ') AS category, users.*, resource_comments.*, comment_creator.name AS comment_creator_name FROM resources FULL OUTER JOIN users ON users.id = resources.user_id LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id LEFT JOIN categories ON resource_categories.category_id = categories.id LEFT JOIN resource_ratings ON resources.id = resource_ratings.resource_id LEFT JOIN resource_comments ON resources.id = resource_comments.resource_id LEFT JOIN users AS comment_creator ON resource_comments.user_id = comment_creator.id WHERE resources.id = ${resource_id} GROUP BY users.id, resources.id, resource_comments.id, comment_creator.name;`
    )
    .then((data) => {
      console.log(data.rows);
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getResources,
  getResourcesbyCategory,
  getResourcesbyCategoryRating,
  getResourcesbyUser,
  getResourcebyResourceId,
};
