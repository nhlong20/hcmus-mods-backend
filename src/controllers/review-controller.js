'use strict';
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const reviewServ = require('../services/review-service');

exports.getAll = catchAsync(async (req, res, next) => {
    const { limit, offset } = req.query;
    const filter = {};
    filter.limit =
        (Number.parseInt(limit) && Number.parseInt(limit) >= 0) || null;
    filter.offset = offset || 0;

    const records = await reviewServ.getAll(filter);
    if (!records || records.length === 0) {
        return next(new AppError('No record found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            reviews: records
        }
    });
});

exports.createOne = catchAsync(async (req, res, next) => {
    const { course_id } = req.params;
    const { account_id } = req.user;
    const { review_body } = req.body;
    const review = { review_body, course_id, account_id };

    const record = await reviewServ.createOne(review);

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
          review: record
        }
    });
});
