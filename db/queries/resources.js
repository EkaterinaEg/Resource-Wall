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
// GET all categories for resource
const getCategoriesbyResourse = (resource_id) => {
  return db
    .query(
      `SELECT name FROM categories JOIN resource_categories ON category_id = categories.id WHERE resource_categories.resource_id = ${resource_id}`
    )

    .then((data) => {
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
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getResourcesbyUser = (user_id) => {
  return db
    .query("SELECT * FROM resources WHERE resources.user_id = user.id;")
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// My resources
const getUserResources = (user_id) => {
  const query1 = db.query(`SELECT * FROM users;`);
  const query2 = pool.query(`SELECT * FROM resources;`);

  return Promise.all([query1, query2])
    .then((results) => {
      // results is an array where each position corresponds to the resolved value of each promise
      const table1Data = results[0].rows;
      const table2Data = results[1].rows;
      // We return an object that contains data from both tables
      return { table1Data, table2Data };
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
  getUserResources,
  getCategoriesbyResourse,
};
