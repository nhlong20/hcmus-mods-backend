'use strict';
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const courseServ = require('../services/course-service');

exports.getAll = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.query.limit) filter = { ...filter, limit: req.query.limit };
    const courses = await courseServ.getCourses(filter);

    if (!courses || courses.length === 0) {
        return next(new AppError('No record found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            courses
        }
    });
});

exports.getOne = catchAsync(async (req, res, next) => {
    const { course_id } = req.params;
    const course = await courseServ.getCourse(course_id);
    if (!course || course.length === 0) {
        return next(new AppError('No record found with that id', 404));
    }
    res.status(201).json({
        status: 'success',
        data: {
            course
        }
    });
});

exports.createOne = catchAsync(async (req, res, next) => {
    const course = 'hello';
    res.status(201).json({
        status: 'success',
        data: {
            course
        }
    });
});
