const db = require("../connection");

const getResources = () => {
  return db.query("SELECT * FROM resources;").then((data) => {
    return data.rows;
  });
};

// Get resources by search from main page
const getResourcesbyCategory = (category) => {
  return db
    .query("SELECT * FROM resources WHERE resourses.category = category;")
    .then((data) => {
      return data.rows;
    });
};

// Get resources by search from search page
const getResourcesbyCategoryRating = (options) => {
  const queryParams = [];

  let queryString = `SELECT resources*, AVG(resource_reviews.rating) as average_rating
  FROM resources
  JOIN resource_reviews ON resource.id = resource_id
  JOIN resource_category ON resource.id = resource_id
  `;
  if (options.category) {
    queryParams.push(`%${options.category}%`);
    queryString += `WHERE category LIKE $${queryParams.length} `;
  }
  queryString += `
  GROUP BY resorces.id
  `;
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `HAVING AVG(resource_reviews.rating) > $${queryParams.length} `;
  }
  return db
    .query("SELECT * FROM resources WHERE resourses.category = category;")
    .then((data) => {
      return data.rows;
    });
};

module.exports = {
  getResources,
  getResourcesbyCategory,
  getResourcesbyCategoryRating,
};
