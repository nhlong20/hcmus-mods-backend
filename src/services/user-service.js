const bcrypt = require('bcryptjs');
const pool = require('../database');

encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
exports.validPassword = function (inputPwd, userPwd) {
    return bcrypt.compareSync(inputPwd, userPwd);
};

exports.getAccount = async _id => {
    const sql = `SELECT * FROM accounts WHERE account_id = $1`;
    const record = await pool.query(sql, [_id]);
    return record.rows[0];
};

exports.getAll = async (filter, acc_type) => {
    const sql = `SELECT acc.acc_type, acc.username, acc.refresh_token,acc.created_at, s.* 
            FROM accounts acc
              NATURAL JOIN ${acc_type}s s
              WHERE acc.account_id = s.account_id 
              ORDER BY acc.username ASC
              LIMIT $1
              OFFSET $2`;
    const records = await pool.query(sql, [filter.limit, filter.offset]);
    return records.rows;
};

exports.getOne = async data => {
    const sql = `SELECT acc.acc_type, acc.username, acc.refresh_token,acc.created_at,s.* 
                  FROM accounts acc 
                  NATURAL JOIN ${data.acc_type}s s 
                  WHERE acc.account_id = s.account_id AND acc.account_id = $1`;
    const records = await pool.query(sql, [data.user_id]);
    return records.rows[0];
};

exports.getOneByUsername = async data => {
    const sql = `SELECT acc.acc_type, acc.username, acc.refresh_token,acc.created_at,s.*
                FROM accounts acc 
                NATURAL JOIN ${data.acc_type}s s 
                WHERE acc.account_id = s.account_id AND acc.username = $1`;
    const records = await pool.query(sql, [data.username]);
    return records.rows[0];
};

exports.createAccount = async (acc_type, username, password) => {
    const hashedPassword = encryptPassword(password);
    let sql = `INSERT INTO Accounts (acc_type, username, passwd) VALUES ($1,$2,$3) RETURNING *`;
    const record = await pool.query(sql, [
        acc_type.toLowerCase(),
        username,
        hashedPassword
    ]);
    return record.rows[0];
};
exports.createOne = async user => {
    const sql = `INSERT INTO ${user.acc_type}s 
                  (${user.acc_type}_id, account_id, fullname, gender, dob, phone, addr) 
                  VALUES ($1,$2,$3,$4,$5,$6,$7) 
                  RETURNING *`;
    const record = await pool.query(sql, [
        user.username,
        user.account_id,
        user.fullname,
        user.gender,
        user.dob,
        user.phone,
        user.addr
    ]);
    return record.rows[0];
};

exports.updateOne = async user => {
    const sql = `UPDATE ${user.acc_type}s 
  SET fullname = $1,
      gender = $2,
      dob = $3,
      phone = $4,
      addr = $5
  WHERE account_id = $6 RETURNING *`;

    await pool.query(sql, [
        user.fullname,
        user.gender,
        user.dob,
        user.phone,
        user.addr,
        user.user_id
    ]);
    updatedOne = this.getOne(user);
    return updatedOne;
};
