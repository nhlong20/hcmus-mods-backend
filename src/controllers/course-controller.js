'use strict'
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const pool = require('../database')

exports.createOne = catchAsync(async(req, res, next) => {
  const course = "hello"

  res.status(201).json({
    status: "success",
    data: {
      course
    }
  })
});

exports.getOne = catchAsync(async(req, res, next) => {
  const {course_id} = req.params;
  console.log(course_id)
  const text = `SELECT c.course_id, 
  su.name as "subject_name", 
  sh.start_at, sh.end_at,
  t.fullname as "teacher_name", c.day_of_week, c.room
  FROM courses c
  LEFT JOIN subjects su USING (subject_id)
  LEFT JOIN shifts sh USING (shift_id)
  LEFT JOIN teachers t USING (teacher_id)
  WHERE c.course_id = $1`

  const courses = await pool.query(text, [course_id])
  const course = courses.rows[0]
  console.table(course)
  res.status(201).json({
    status: "success",
    data: {
      course
    }
  })
});
