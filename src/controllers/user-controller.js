'use strict';
const userService = require('../services/user-service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwthelper = require('../utils/jsonwebtoken');
const pool = require('../database');
const userServ = require('../services/user-service');

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '1h';
const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-example';

const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '3650d';
const refreshTokenSecret =
    process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret-example';

exports.getUsers = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.query.limit) filter = { ...filter, limit: req.query.limit };
    if (req.query.offset) filter = { ...filter, offset: req.query.offset };
    const { acc_type } = req.body;
    if (!acc_type) {
        return next(
            new AppError('You must include acc_type to json request', 400)
        );
    }
    const records = await userServ.getAll(filter, acc_type);

    if (!records || records.length === 0) {
        return next(new AppError('No record found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            users: records
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const { user_id } = req.params;
    const { acc_type } = req.body;
    if (!acc_type) {
        return next(
            new AppError('You must include acc_type to json request', 400)
        );
    }
    const record = await userServ.getOne({ user_id, acc_type });
    if (!record || record.length === 0) {
        return next(new AppError('No record found with that id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user: record
        }
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
    // hash password
    const { username, password, acc_type, fullname, gender, dob, phone, addr } =
        req.body;

    // Check exíting account
    const record = await userServ.getOneByUsername({ acc_type, username });
    if (record && record.length !== 0) {
        return next(new AppError('Account is already existed', 400));
    }

    const account = await userServ.createAccount(acc_type, username, password);

    const userData = {
        username,
        acc_type: acc_type.toLowerCase(),
        account_id: account.account_id,
        fullname,
        gender,
        dob,
        phone,
        addr
    };
    const userInfo = await userServ.createOne(userData);

    res.status(201).json({
        status: 'success',
        data: {
            new_user: {
                ...account,
                ...userInfo
            }
        }
    });
});

exports.loginUser = catchAsync(async (req, res, next) => {
    console.log('User Login data: > ', req.body);
    const { acc_type, username, password } = req.body;
    const record = await userServ.getOneByUsername({ acc_type, username });

    if (!record || record.length === 0) {
        return next(new AppError('No user found with that username', 404));
    }

    const result = await userService.validPassword(password, record.passwd);

    if (!result) return next(new AppError('Password is incorrect', 404));
    let user = { ...record };

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

    let sql = 'UPDATE Accounts SET refresh_token = $1 WHERE account_id = $2';
    await pool.query(sql, [refreshToken, user.account_id]);

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
    const { acc_type, fullname, gender, dob, phone, addr } = req.body;
    const userData = {
        user_id,
        acc_type,
        fullname,
        gender,
        dob,
        phone,
        addr
    };
    const record = await userServ.updateOne(userData);

    if (!record || record.length === 0) {
        return next(new AppError('Failed when updating the record', 400));
    }
    res.status(201).json({
        status: 'success',
        data: {
            user: record
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const { user_id } = req.params;
    const { acc_type } = req.body;
    let queryString = `DELETE FROM ${acc_type}s s WHERE s.account_id = $1 RETURNING *`;
    await pool.query(queryString, [user_id]);

    queryString = `DELETE FROM accounts s WHERE s.account_id = $1`;
    await pool.query(queryString, [user_id]);

    res.status(204).json({
        status: 'success',
        data: {}
    });
});
