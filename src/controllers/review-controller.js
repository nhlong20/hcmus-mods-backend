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
