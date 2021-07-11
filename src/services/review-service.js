const pool = require('../database');
const { v4: uuidv4 } = require('uuid');

exports.getAll = async filter => {
    let sql = `SELECT * from reviews r
                NATURAL JOIN students s 
                LIMIT $1 OFFSET $2`;
    const records = await pool.query(sql, [filter.limit, filter.offset]);
    return records.rows;
};

exports.getOne = async _id => {
    const sql = `SELECT * from reviews r
                  NATURAL JOIN students s 
                  WHERE r.review_id = $1`;
    const records = await pool.query(sql, [_id]);
    return records.rows[0];
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

exports.updateOne = async review => {
    const sql = `UPDATE reviews 
                  SET review_body = $1
                  WHERE review_id = $2 RETURNING *`;
    const records = await pool.query(sql, [
        review.review_body,
        review.review_id
    ]);
    return records.rows[0];
};

exports.deleteOne = async _id => {
    const sql = `DELETE FROM reviews 
                WHERE review_id = $1 RETURNING *`;
    const records = await pool.query(sql, [_id]);
    return records.rows[0];
};
