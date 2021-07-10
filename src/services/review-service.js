const pool = require('../database');

exports.getAll = async filter => {
  let sql = `SELECT * from reviews LIMIT $1 OFFSET $2`;
  const records = await pool.query(sql, [filter.limit, filter.offset]);
  return records.rows;
};
