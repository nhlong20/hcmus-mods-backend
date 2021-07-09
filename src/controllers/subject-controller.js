'use strict';
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const subjectServ = require('../services/subject-service');

exports.getAll = catchAsync(async (req, res, next) => {
    const { limit, offset } = req.query;
    const filter = {};
    filter.limit =
        (Number.parseInt(limit) && Number.parseInt(limit) >= 0) || null;
    filter.offset = offset || 0;

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
    const { subject_id, prerequisite_subject, name, credits } = req.body;
    const subject = { subject_id, prerequisite_subject, name, credits };

    const record = await subjectServ.createOne(subject);

    if (!record || record.length === 0) {
        return next(
            new AppError(
                'Some thing went wrong when creating new subject, try again',
                400
            )
        );
    }
    res.status(201).json({
        status: 'success',
        data: {
            subject: record
        }
    });
});

exports.updateOne = catchAsync(async (req, res, next) => {
    const { subject_id } = req.params;
    const { prerequisite_subject, name, credits } = req.body;
    const subject = { subject_id, prerequisite_subject, name, credits };
    const record = await subjectServ.updateOne(subject);

    if (!record || record.length === 0) {
        return next(
            new AppError(
                'Some thing went wrong when updating new record, try again',
                400
            )
        );
    }
    res.status(201).json({
        status: 'success',
        data: {
            subject: record
        }
    });
});
