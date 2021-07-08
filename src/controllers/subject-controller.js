'use strict';
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const subjectServ = require('../services/subject-service');

exports.getAll = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.query.limit) filter = { ...filter, limit: req.query.limit };
    const records = await subjectServ.getAll(filter);

    if (!records || records.length === 0) {
        return next(new AppError('No record found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            subjects: records
        }
    });
});

exports.getOne = catchAsync(async (req, res, next) => {
    const { subject_id } = req.params;
    const record = await subjectServ.getOne(subject_id);
    if (!record || record.length === 0) {
        return next(new AppError('No record found with that id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            subject: record
        }
    });
});

exports.createOne = catchAsync(async (req, res, next) => {
  
});
