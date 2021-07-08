const userService = require('../services/user-service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwthelper = require('../utils/jsonwebtoken');
const pool = require('../database');
const bcrypt = require('bcryptjs');

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '1h';
const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-example';

const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '3650d';
const refreshTokenSecret =
    process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret-example';

exports.aliasTopUsers = (req, res, next) => {
    req.query.limit = '10';
    req.query.fields = 'username, fullname';
    next();
};

exports.getUsers = catchAsync(async (req, res, next) => {
    filter = {};
    if (req.query.limit) filter = { ...filter, limit: req.query.limit };
    const { acc_type } = req.body
    if(!acc_type){
        return next(new AppError('You must include acc_type to json request', 400));
    }

    const queryString = `SELECT * FROM accounts acc
                        NATURAL JOIN ${acc_type}s s
                        WHERE acc.account_id = s.account_id 
                        ORDER BY acc.username ASC
                        ${filter.limit ? 'LIMIT ' + filter.limit : ''}`;
    const users = await pool.query(queryString);

    res.status(201).json({
        status: 'success',
        data: {
            users: users.rows
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const { user_id } = req.params;
    const { acc_type } = req.body
    if(!acc_type){
        return next(new AppError('You must include acc_type to json request', 400));
    }
    
    const queryString = `SELECT * 
    FROM accounts acc 
     NATURAL JOIN ${acc_type}s s 
     WHERE acc.account_id = s.account_id AND acc.account_id = $1`;
    const users = await pool.query(queryString, [user_id]);

    if(users.rows.length === 0){
        return next(new AppError('No user found with that username', 404));
    }
    let user = users.rows[0];

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
    // hash password
    const { username, password, acc_type } = req.body;
    const hashedPassword = userService.encryptPassword(password);
    let queryString = `INSERT INTO Accounts (acc_type, username, passwd) VALUES ($1,$2,$3) RETURNING *`;
    const users = await pool.query(queryString, [
        acc_type.toLowerCase(),
        username,
        hashedPassword
    ]);

    const user = users.rows[0];
    let accType = acc_type.toLowerCase();
    queryString = `INSERT INTO ${accType}s (${accType}_id, account_id) VALUES ($1,$2) RETURNING *`;
    const userInfos = await pool.query(queryString, [
        user.username,
        user.account_id
    ]);

    res.status(201).json({
        status: 'success',
        data: {
            new_user: {
                ...user,
                ...userInfos.rows[0]
            }
        }
    });
});

exports.loginUser = catchAsync(async (req, res, next) => {
    console.log('User Login data: > ', req.body);
    const { username, password } = req.body;
    let queryString = `SELECT * FROM accounts acc WHERE acc.username = $1`;
    const users = await pool.query(queryString, [username]);

    if (users.rows.length === 0) {
        return next(new AppError('No user found with that username', 404));
    }
    const result = await userService.validPassword(
        password,
        users.rows[0].passwd
    );
    if (!result) return next(new AppError('Password is incorrect', 404));
    let user = users.rows[0];
    // populate data
    accType = user.acc_type.toLowerCase() + 's';
    queryString = `SELECT * FROM ${accType} WHERE account_id = $1`;

    const userInfo = await pool.query(queryString, [user.account_id]);

    user = { ...user, ...userInfo.rows[0] };

    let dataPayload = {
        account_id: user.account_id,
        user_name: user.username
    };
    const token = await jwthelper.generateToken(
        dataPayload,
        accessTokenSecret,
        accessTokenLife
    );
    const refreshToken = await jwthelper.generateToken(
        dataPayload,
        refreshTokenSecret,
        refreshTokenLife
    );

    queryString =
        'UPDATE Accounts SET refresh_token = $1 WHERE account_id = $2';
    await pool.query(queryString, [refreshToken, user.account_id]);

    res.cookie('refresh_token', refreshToken, { httpOnly: true });

    res.status(200).json({
        status: 'success',
        data: {
            token,
            refreshToken,
            user
        }
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const { user_id } = req.params;
    const {acc_type, fullname, gender, dob, phone, addr} = req.body
    const queryString = `UPDATE ${acc_type}s 
                            SET fullname = $1,
                                gender = $2,
                                dob = $3,
                                phone = $4,
                                addr = $5
                            WHERE account_id = $6 RETURNING *`;

    const updatedUser = await pool.query(queryString, [fullname, gender, dob, phone, addr, user_id]);
    let user = updatedUser.rows[0]
    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
   
});
