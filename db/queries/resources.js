const db = require("../connection");

const getResources = () => {
  return db
    .query(
      "SELECT resources.*, ROUND(AVG(resource_ratings.rating),0) AS rating, STRING_AGG(DISTINCT categories.name, ', ') AS category FROM resources LEFT JOIN resource_categories ON resources.id = resource_categories.resource_id LEFT JOIN categories ON resource_categories.category_id = categories.id LEFT JOIN resource_ratings ON resources.id = resource_ratings.resource_id GROUP BY resources.id;"
    )
    .then((data) => {
      // console.log(data.rows);
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
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

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
const updateRating = (user_id, resource_id, rating) => {
  const queryParams = [user_id, resource_id, rating];
  let queryString = `INSERT INTO resource_ratings(user_id, resource_id, rating)
  VALUES($1, $2, $3) RETURNING *;`;

  console.log(queryString);
  return db
    .query(queryString, queryParams)
    .then((data) => {
      console.log(data.rows);
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addComments = (user_id, resource_id, comment) => {
  const queryParams = [user_id, resource_id, comment];
  let queryString = `INSERT INTO resource_comments(user_id, resourse_id, comment)
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
const isFavourite = (resource_id) => {
  return db
    .query(
      `SELECT favourite_resources.* FROM favourite_resources WHERE favourite_resources.resource_id = ${resource_id};`
    )
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const updateSingleResource = function (user_id, resource_id, rating, comment) {
  // We create one promise for each table query
  // const query4 = updateResourceTable(resource_id, description, title, link);
  const query1 = updateRating(user_id, resource_id, rating);
  const query2 = addComments(user_id, resource_id, comment);
  const query3 = isFavourite(resource_id);
  const query4 = addCategory(resource_id, category_id);
  // Use Promise.all to resolve all promises
  return Promise.all([query1, query2, query3, query4])
    .then((results) => {
      // results is an array where each position corresponds to the resolved value of each promise
      const table1Data = results[0].rows;
      const table2Data = results[1].rows;
      const table3Data = results[2].rows;
      const table4Data = results[3].rows;
      // We return an object that contains data from both tables
      console.log(table1Data);
      console.log(table2Data);
      console.log(table3Data);
      console.log(table4Data);
      return { table1Data, table2Data, table3Data, table4Data };
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
  updateResourceTable,
  updateRating,
  addComments,
  updateSingleResource,
};
