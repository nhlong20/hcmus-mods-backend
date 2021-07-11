'use strict';
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const pool = require('../database');
const userServ = require('../services/user-service');

exports.getUsers = catchAsync(async (req, res, next) => {
    let { limit, offset } = req.query;
    const filter = {};
    limit = Number.parseInt(limit);
    filter.limit = limit && limit >= 0 ? limit : null;
    filter.offset = offset || 0;

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
            count: records.length,
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

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead'
    });
};
