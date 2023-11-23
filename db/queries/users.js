const db = require("../connection");

const getUsers = () => {
  return db.query("SELECT * FROM users;").then((data) => {
    return data.rows;
  });
};

const getUserById = (user_id) => {
  return db
    .query(`SELECT * FROM users WHERE users.id = ${user_id};`)
    .then((data) => {
      console.log("query:", data.rows[0]);
      return data.rows[0];
    });
};

const updateUsers = (user_id, options) => {
  // const queryParams = [user_id, name, email, password];
  const queryParams = [];

  let queryString = `UPDATE users SET `;
  console.log(options.name);
  console.log(options.email);
  if (options.name) {
    queryParams.push(`%${options.name}%`);
    queryString += `name = $${queryParams.length} `;
  }
  if (options.email) {
    queryParams.push(`%${options.email}%`);
    queryString += `email = $${queryParams.length} `;
  }
  if (options.password) {
    queryParams.push(`%${options.password}%`);
    queryString += `password = $${queryParams.length} `;
  }
  queryString += `
  WHERE users.id = ${user_id} RETURNING * ;
  `;
  console.log(queryString);
  console.log(queryParams);
  return db
    .query(queryString, queryParams)
    .then((data) => {
      console.log("query:", data.rows[0]);
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { getUsers, getUserById, updateUsers };
