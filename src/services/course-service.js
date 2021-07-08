const AppError = require('../utils/appError');
const pool = require('../database');

exports.getCourses = async filter => {
    let sql = `SELECT c.course_id, 
                su.name as "subject_name", 
                sh.start_at, sh.end_at,
                t.fullname as "teacher_name", c.day_of_week, c.room
                FROM courses c
                LEFT JOIN subjects su USING (subject_id)
                LEFT JOIN shifts sh USING (shift_id)
                LEFT JOIN teachers t USING (teacher_id)
                LIMIT $1`;

    const courses = await pool.query(sql, [filter.limit]);
    return courses.rows;
};

exports.getCourse = async course_id => {
    const sql = `SELECT c.course_id, 
                  su.name as "subject_name", 
                  sh.start_at, sh.end_at,
                  t.fullname as "teacher_name", c.day_of_week, c.room
                  FROM courses c
                  LEFT JOIN subjects su USING (subject_id)
                  LEFT JOIN shifts sh USING (shift_id)
                  LEFT JOIN teachers t USING (teacher_id)
                  WHERE c.course_id = $1`;

    const courses = await pool.query(sql, [course_id]);
    return courses.rows[0];
};
