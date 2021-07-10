const pool = require('../database');
const { v4: uuidv4 } = require('uuid');

exports.getAll = async filter => {
    let sql = `SELECT * from reviews LIMIT $1 OFFSET $2`;
    const records = await pool.query(sql, [filter.limit, filter.offset]);
    return records.rows;
};
exports.createOne = async review => {
    const sql = `INSERT INTO reviews (review_id, course_id, account_id, review_body) 
                  VALUES ($1, $2, $3, $4) RETURNING *`;
    const records = await pool.query(sql, [
        uuidv4(),
        review.course_id,
        review.account_id,
        review.review_body
    ]);
    return records.rows[0];
};
