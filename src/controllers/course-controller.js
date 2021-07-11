'use strict';
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const courseServ = require('../services/course-service');

exports.getAll = catchAsync(async (req, res, next) => {
    let { limit, offset } = req.query;
    const filter = {};
    limit = Number.parseInt(limit);
    filter.limit = limit && limit >= 0 ? limit : null;
    filter.offset = offset || 0;

    const courses = await courseServ.getAll(filter);

    // if (!courses || courses.length === 0) {
    //     return next(new AppError('No record found', 404));
    // }

    res.status(200).json({
        status: 'success',
        data: {
            courses
        }
    });
});

exports.getOne = catchAsync(async (req, res, next) => {
    const { course_id } = req.params;

    const course = await courseServ.getOne(course_id);
    // if (!course || course.length === 0) {
    //     return next(new AppError('No record found with that id', 404));
    // }

    res.status(201).json({
        status: 'success',
        data: {
            course
        }
    });
});

exports.createOne = catchAsync(async (req, res, next) => {
    const {
        course_id,
        subject_id,
        shift_id,
        semester_id,
        teacher_id,
        day_of_week,
        room,
        start_date,
        course_length_weeks
    } = req.body;

    const course = {
        course_id,
        subject_id,
        shift_id,
        semester_id,
        teacher_id,
        day_of_week,
        room,
        start_date,
        course_length_weeks
    };
    const record = await courseServ.createOne(course);

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
            course: record
        }
    });
});
