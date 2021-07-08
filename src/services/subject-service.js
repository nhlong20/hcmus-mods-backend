const AppError = require('../utils/appError');
const pool = require('../database');

exports.getAll = async filter => {
    let sql = `SELECT * from subjects LIMIT $1`;
    const records = await pool.query(sql, [filter.limit]);
    return records.rows;
};

exports.getOne = async (_id) => {
    const sql = `SELECT * from subjects WHERE subject_id = $1`;
    const records = await pool.query(sql, [_id]);
    return records.rows[0];
};
