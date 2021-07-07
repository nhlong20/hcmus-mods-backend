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

exports.getUser = catchAsync(async (req, res, next) => {
    const { user_id } = req.params;
    const text = `SELECT * FROM accounts acc WHERE acc.account_id = $1`;

    const users = await pool.query(text, [user_id]);
    const user = users.rows[0];

    res.status(201).json({
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
    const text = `INSERT INTO Accounts (acc_type, username, passwd) VALUES ($1,$2,$3) RETURNING *`;

    const users = await pool.query(text, [acc_type, username, hashedPassword]);

    res.status(201).json({
        status: 'success',
        data: {
            users: users.rows[0]
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
