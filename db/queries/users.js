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
      return data.rows[0];
    });
};

const updateUsers = (name, email, password, user_id) => {
  const queryParams = [];
  const valueForRequest = [];

  let queryString = `UPDATE users SET `;

  if (name) {
    queryParams.push(`${name}`);
    valueForRequest.push(`name = $${queryParams.length}`);
  }
  if (email) {
    queryParams.push(`${email}`);
    valueForRequest.push(`email = $${queryParams.length}`);
  }
  if (password) {
    queryParams.push(`${password}`);
    valueForRequest.push(`password = $${queryParams.length}`);
  }
  queryString += valueForRequest.join(", ");
  queryString += `
  WHERE users.id = ${user_id} RETURNING * ;
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

module.exports = { getUsers, getUserById, updateUsers };
