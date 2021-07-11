const pool = require('../database');

exports.getAll = async filter => {
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

exports.getOne = async course_id => {
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

exports.createOne = async course => {
    const sql = `INSERT INTO 
        courses (course_id, subject_id, shift_id, semester_id, 
        teacher_id, day_of_week, room, start_date, course_length_weeks) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    const records = await pool.query(sql, [
        course.course_id,
        course.subject_id,
        course.shift_id,
        course.semester_id,
        course.teacher_id,
        course.day_of_week,
        course.room,
        course.start_date,
        course.course_length_weeks,
    ]);
    return records.rows[0];
};