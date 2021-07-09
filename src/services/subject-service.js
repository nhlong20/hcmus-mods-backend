const AppError = require('../utils/appError');
const pool = require('../database');

exports.getAll = async filter => {
    let sql = `SELECT * from subjects LIMIT $1 OFFSET $2`;
    const records = await pool.query(sql, [filter.limit, filter.offset]);
    return records.rows;
};

exports.getOne = async _id => {
    const sql = `SELECT * from subjects WHERE subject_id = $1`;
    const records = await pool.query(sql, [_id]);
    return records.rows[0];
};

exports.createOne = async subject => {
    const sql = `INSERT INTO subjects (subject_id, prerequisite_subject, name, credits) 
                    VALUES ($1, $2, $3, $4) RETURNING *`;
    const records = await pool.query(sql, [
        subject.subject_id,
        subject.prerequisite_subject,
        subject.name,
        subject.credits
    ]);
    return records.rows[0];
};
