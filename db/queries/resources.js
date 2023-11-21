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
    queryParams.push(`%${options.category}%`);
    queryString += `WHERE categories.name LIKE $${queryParams.length} `;
  }

  queryString += `
  GROUP BY resources.id
  `;
  if (options.rating) {
    queryParams.push(Number(options.rating));
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
      `SELECT resources.*, ROUND(AVG(resource_ratings.rating),0) AS rating, STRING_AGG(DISTINCT categories.name, ', ') AS category FROM resources LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id LEFT JOIN categories ON resource_categories.category_id = categories.id LEFT JOIN resource_ratings ON resources.id = resource_ratings.resource_id WHERE resources.user_id = ${user_id} GROUP BY resources.id;`
    )
    .then((data) => {
      return data.rows;
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
};
