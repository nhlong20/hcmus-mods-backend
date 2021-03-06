CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS Accounts CASCADE;
DROP TABLE IF EXISTS Teachers CASCADE;
DROP TABLE IF EXISTS Moderators CASCADE;
DROP TABLE IF EXISTS Admins CASCADE;
DROP TABLE IF EXISTS Shifts CASCADE;
DROP TABLE IF EXISTS Subjects CASCADE;
DROP TABLE IF EXISTS Student_Course CASCADE;
DROP TABLE IF EXISTS Courses CASCADE;
DROP TABLE IF EXISTS RegistrationSessions CASCADE;
DROP TABLE IF EXISTS Semesters CASCADE;
DROP TABLE IF EXISTS Students CASCADE;
DROP TABLE IF EXISTS Modules CASCADE;
DROP TABLE IF EXISTS Courseworks CASCADE;
DROP TABLE IF EXISTS Lectures CASCADE;
DROP TABLE IF EXISTS Reviews CASCADE;
DROP TABLE IF EXISTS Comments CASCADE;
DROP TABLE IF EXISTS Topics CASCADE;
DROP TABLE IF EXISTS Appendix CASCADE;

CREATE TABLE Accounts (
  account_id          SERIAL NOT NULL,
  acc_type            varchar(10) NOT NULL,
  username            varchar(30) UNIQUE NOT NULL,
  passwd              text NOT NULL,
  refresh_token       text,
  created_at          timestamp without time zone default CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE Teachers (
  teacher_id  varchar(20) NOT NULL, 
  account_id  integer NOT NULL,
  fullname    varchar(50),
  gender      varchar(3) CHECK (gender in ('Nam', 'Nữ')),
  dob         date CHECK (dob > '1900-01-01'),
  phone       varchar(20),
  addr        varchar(100)
  );

CREATE TABLE Moderators (
  moderator_id varchar(20) NOT NULL, 
  account_id   integer NOT NULL,
  fullname     varchar(50),
  gender       varchar(3) CHECK (gender in ('Nam', 'Nữ')),
  dob          date CHECK (dob > '1900-01-01'),
  phone        varchar(20),
  addr         varchar(100)
  );

CREATE TABLE Admins (
  admin_id   varchar(20) NOT NULL, 
  account_id integer NOT NULL,
  fullname   varchar(50),
  gender     varchar(3) CHECK (gender in ('Nam', 'Nữ')),
  dob        date CHECK (dob > '1900-01-01'),
  phone      varchar(20),
  addr       varchar(100)
  );

CREATE TABLE Shifts (
  shift_id  SERIAL NOT NULL,
  start_at  TIME NOT NULL,
  end_at    TIME NOT NULL
  );

CREATE TABLE Subjects (
  subject_id            varchar(20) NOT NULL, 
  prerequisite_subject  varchar(20),
  name                  varchar(100),
  credits               integer
  );
  
CREATE TABLE Student_Course (
  student_id varchar(20) NOT NULL, 
  course_id  varchar(20) NOT NULL,
  created_at timestamp without time zone default CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE Courses (
  course_id             varchar(20) NOT NULL, 
  subject_id            varchar(10) NOT NULL, 
  shift_id              integer NOT NULL, 
  semester_id           integer NOT NULL, 
  teacher_id            varchar(20),
  day_of_week           varchar(10) CHECK (day_of_week in ('Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','Chủ Nhật')),
  room                  varchar(10),
  start_date            date CHECK (start_date > '1900-01-01'),
  course_length_weeks   integer
  );

CREATE TABLE RegistrationSessions (
  reg_session_id  UUID DEFAULT uuid_generate_v4 (), 
  semester_id     integer NOT NULL,
  start_date      date NOT NULL CHECK (start_date > '1900-01-01'),
  end_date        date NOT NULL CHECK (end_date >= start_date)
  );

CREATE TABLE Semesters (
  semester_id       SERIAL NOT NULL,
  sem_name          varchar(3) NOT NULL,
  sem_year          integer NOT NULL,
  is_current_sem    boolean NOT NULL default false,
  start_date        date NOT NULL CHECK (start_date > '1900-01-01'),
  end_date          date NOT NULL CHECK (end_date > start_date)
  );

CREATE TABLE Students (
  student_id VARCHAR(20) NOT NULL,
  account_id integer NOT NULL,
  fullname   varchar(50),
  gender     varchar(3) CHECK (gender in ('Nam', 'Nữ')),
  dob        date CHECK (dob > '1900-01-01'),
  phone      varchar(20),
  addr       varchar(100)
  );

CREATE TABLE Modules (
  module_id   UUID DEFAULT uuid_generate_v4 (), 
  course_id   varchar(20) NOT NULL,
  module_name varchar(100) NOT NULL,
  created_at  timestamp without time zone default CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE Courseworks (
  coursework_id     UUID DEFAULT uuid_generate_v4 (), 
  module_id         UUID NOT NULL,
  title             varchar(100) NOT NULL,
  requirement_link  text,
  coursework_type   integer,
  deadline          date NOT NULL CHECK (deadline > '1900-01-01') NOT NULL,
  created_at        timestamp without time zone default CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE Lectures (
  lecture_id    UUID DEFAULT uuid_generate_v4 (), 
  module_id     UUID NOT NULL,
  order_no         integer,
  link          text,
  lecture_name  varchar(200),
  created_at    timestamp without time zone default CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE Reviews (
  review_id  UUID DEFAULT uuid_generate_v4 (), 
  course_id  varchar(20) NOT NULL, 
  account_id integer NOT NULL,
  review_body varchar(360),
  created_at timestamp without time zone default CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE Comments (
  comment_id  UUID DEFAULT uuid_generate_v4 (), 
  topic_id    UUID NOT NULL, 
  account_id  integer NOT NULL,
  content     varchar(400),
  created_at  timestamp without time zone default CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE Topics (
  topic_id    UUID DEFAULT uuid_generate_v4 (),
  course_id   varchar(20) NOT NULL, 
  title       varchar(200),
  content     text,
  created_at  timestamp without time zone default CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE Appendix (
  appendix_id   UUID DEFAULT uuid_generate_v4 (), 
  module_id     UUID NOT NULL,
  appendix_link text
  );


ALTER TABLE Accounts ADD PRIMARY KEY (account_id);
ALTER TABLE Teachers ADD PRIMARY KEY (teacher_id);
ALTER TABLE Moderators ADD PRIMARY KEY (moderator_id);
ALTER TABLE Admins ADD PRIMARY KEY (admin_id);
ALTER TABLE Shifts ADD PRIMARY KEY (shift_id);
ALTER TABLE Subjects ADD PRIMARY KEY (subject_id);
ALTER TABLE Courses ADD PRIMARY KEY (course_id);
ALTER TABLE RegistrationSessions ADD PRIMARY KEY (reg_session_id);
ALTER TABLE Semesters ADD PRIMARY KEY (semester_id);
ALTER TABLE Students ADD PRIMARY KEY (student_id);
ALTER TABLE Modules ADD PRIMARY KEY (module_id);
ALTER TABLE Courseworks ADD PRIMARY KEY (coursework_id);
ALTER TABLE Lectures ADD PRIMARY KEY (lecture_id);
ALTER TABLE Reviews ADD PRIMARY KEY (review_id);
ALTER TABLE Comments ADD PRIMARY KEY (comment_id);
ALTER TABLE Topics ADD PRIMARY KEY (topic_id);
ALTER TABLE Appendix ADD PRIMARY KEY (appendix_id);


-- ALTER TABLE Courses DROP CONSTRAINT FK_course__subject_id;
-- ALTER TABLE Student_Course DROP CONSTRAINT FK_course_student__course_id;
-- ALTER TABLE RegistrationSessions DROP CONSTRAINT FK_courseregistrationsession__semester_id;
-- ALTER TABLE Courses DROP CONSTRAINT FK_course__shift_id;
-- ALTER TABLE Student_Course DROP CONSTRAINT FKStudent_Co197422;
-- ALTER TABLE Teachers DROP CONSTRAINT FK_teacher__account_id;
-- ALTER TABLE Moderators DROP CONSTRAINT FK_teacher__account_id;
-- ALTER TABLE Admin DROP CONSTRAINT FKAdmin915765;
-- ALTER TABLE Courses DROP CONSTRAINT FK_course__semester_id;
-- ALTER TABLE Courses DROP CONSTRAINT FK_course__teacher_id;
-- ALTER TABLE Modules DROP CONSTRAINT fk_module__course_id;
-- ALTER TABLE Courseworks DROP CONSTRAINT FKCoursework788508;
-- ALTER TABLE Lectures DROP CONSTRAINT FKLectures99366;
-- ALTER TABLE Subjects DROP CONSTRAINT FKSubjects343910;
-- ALTER TABLE Reviews DROP CONSTRAINT FKReviews59454;
-- ALTER TABLE Topics DROP CONSTRAINT FKTopics865970;
-- ALTER TABLE Students DROP CONSTRAINT FKStudents507314;
-- ALTER TABLE Comments DROP CONSTRAINT FKComments27586;
-- ALTER TABLE Comments DROP CONSTRAINT FKComments444776;
-- ALTER TABLE Appendix DROP CONSTRAINT FKAppendix764589;
-- ALTER TABLE Reviews DROP CONSTRAINT FKReviews562743;

ALTER TABLE Courses ADD CONSTRAINT FK_course__subject_id FOREIGN KEY (subject_id) REFERENCES Subjects (subject_id);
ALTER TABLE Student_Course ADD CONSTRAINT FK_course_student__course_id FOREIGN KEY (course_id) REFERENCES Courses (course_id);
ALTER TABLE RegistrationSessions ADD CONSTRAINT FK_courseregistrationsession__semester_id FOREIGN KEY (semester_id) REFERENCES Semesters (semester_id);
ALTER TABLE Courses ADD CONSTRAINT FK_course__shift_id FOREIGN KEY (shift_id) REFERENCES Shifts (shift_id);
ALTER TABLE Student_Course ADD CONSTRAINT FKStudent_Co197422 FOREIGN KEY (student_id) REFERENCES Students (student_id);
ALTER TABLE Teachers ADD CONSTRAINT FK_teacher__account_id FOREIGN KEY (account_id) REFERENCES Accounts (account_id) ON DELETE CASCADE;
ALTER TABLE Moderators ADD CONSTRAINT FK_moderator__account_id FOREIGN KEY (account_id) REFERENCES Accounts (account_id) ON DELETE CASCADE;
ALTER TABLE Admins ADD CONSTRAINT FKAdmin915765 FOREIGN KEY (account_id) REFERENCES Accounts (account_id) ON DELETE CASCADE;
ALTER TABLE Courses ADD CONSTRAINT FK_course__semester_id FOREIGN KEY (semester_id) REFERENCES Semesters (semester_id);
ALTER TABLE Courses ADD CONSTRAINT FK_course__teacher_id FOREIGN KEY (teacher_id) REFERENCES Teachers (teacher_id) ON DELETE SET NULL;
ALTER TABLE Modules ADD CONSTRAINT fk_module__course_id FOREIGN KEY (course_id) REFERENCES Courses (course_id);
ALTER TABLE Courseworks ADD CONSTRAINT fk_coursework__module_id FOREIGN KEY (module_id) REFERENCES Modules (module_id);
ALTER TABLE Lectures ADD CONSTRAINT fk_lecture__module_id FOREIGN KEY (module_id) REFERENCES Modules (module_id);
ALTER TABLE Subjects ADD CONSTRAINT fk_subject__subject_id FOREIGN KEY (prerequisite_subject) REFERENCES Subjects (subject_id);
ALTER TABLE Reviews ADD CONSTRAINT fk_review__course_id FOREIGN KEY (course_id) REFERENCES Courses (course_id);
ALTER TABLE Topics ADD CONSTRAINT fk_topic__course_id FOREIGN KEY (course_id) REFERENCES Courses (course_id);
ALTER TABLE Students ADD CONSTRAINT fk_student__account_id FOREIGN KEY (account_id) REFERENCES Accounts (account_id) ON DELETE CASCADE;
ALTER TABLE Comments ADD CONSTRAINT fk_comment__account_id FOREIGN KEY (account_id) REFERENCES Accounts (account_id) ON DELETE CASCADE;
ALTER TABLE Comments ADD CONSTRAINT fk_comment__topic_id FOREIGN KEY (topic_id) REFERENCES Topics (topic_id);
ALTER TABLE Appendix ADD CONSTRAINT fk_appendix__module_id FOREIGN KEY (module_id) REFERENCES Modules (module_id);
ALTER TABLE Reviews ADD CONSTRAINT fk_review__account_id FOREIGN KEY (account_id) REFERENCES Accounts (account_id) ON DELETE CASCADE;


INSERT INTO Accounts (account_id, acc_type, username, passwd, created_at) VALUES (default, 'student', '18120444', '$2a$10$/rMxJ60N/AftmeQTJHqT1.qVjfsjgNi1jV1QGctkVz/d1Wk3XpWLe', default);
INSERT INTO Accounts (account_id, acc_type, username, passwd, created_at) VALUES (default, 'student', '18120445', '$2a$10$djzDN4TqOW25clNtTE2BG.7PnqKamPO0vr/Zn3B5syiTY.B7mydVa', default);
INSERT INTO Accounts (account_id, acc_type, username, passwd, created_at) VALUES (default, 'student', '18120443', '$2a$10$jumYnaiTd6q4xUQ7fFPgiOAXhc5dlnGRg3EKv4hQhRrNN7ZwynPVO', default);
INSERT INTO Accounts (account_id, acc_type, username, passwd, created_at) VALUES (default, 'teacher', 'gv001', '$2a$10$Psp2P6FwDqht9m1gJlnWt.aaSwJgRfzA7LQLiNIovzAyURI8Df74C', default);
INSERT INTO Accounts (account_id, acc_type, username, passwd, created_at) VALUES (default, 'teacher', 'gv002', '$2a$10$brvh19ch.GopuzJmly0WtemermPkynZmmv/Pdz.vEWv8AjhbfwLKe', default);
INSERT INTO Accounts (account_id, acc_type, username, passwd, created_at) VALUES (default, 'admin', 'admin', '$2a$10$alAGf2H.UoDUpidIBD7ej.PeaGtJ0aFDv8ln3cTiGifelojgTFYLy', default);

INSERT INTO Subjects (subject_id, name, credits) VALUES ('OOP', 'Lập trình hướng đối tượng', 4);
INSERT INTO Subjects (subject_id, name, credits) VALUES ('CTDLGT', 'Cấu trúc dữ liệu và giải thuật', 4);
INSERT INTO Subjects (subject_id, name, credits) VALUES ('CSDL', 'Cơ sở dữ liệu', 4);
INSERT INTO Subjects (subject_id, name, credits) VALUES ('HDH', 'Hệ điều hành', 4);
INSERT INTO Subjects (subject_id, name, credits) VALUES ('MMT', 'Mạng máy tính', 4);
INSERT INTO Subjects (subject_id, name, credits) VALUES ('DAAS', 'Thiết kế và phân tích phần mềm', 4);
INSERT INTO Subjects (subject_id, name, credits) VALUES ('NMHM', 'Nhập môn học máy', 4);
INSERT INTO Subjects (subject_id, name, credits) VALUES ('XLA', 'Xử lý ảnh', 4);
INSERT INTO Subjects (subject_id, name, credits) VALUES ('LTUDW', 'Lập trình ứng dụng Web', 4);

UPDATE Subjects SET prerequisite_subject = 'CTDLGT'
WHERE subject_id != 'CTDLGT';

INSERT INTO Semesters(semester_id, sem_name, sem_year, start_date, end_date) VALUES (default, 'HK1', 2019, '2019-08-20', '2020-01-20');
INSERT INTO Semesters(semester_id, sem_name, sem_year, start_date, end_date) VALUES (default, 'HK2', 2019, '2020-02-03', '2020-06-28');

INSERT INTO RegistrationSessions(reg_session_id,semester_id, start_date, end_date)
VALUES (default, 1, '2019-08-24', '2019-08-28');

INSERT INTO Shifts(shift_id, start_at, end_at) VALUES (1, '07:30:00', '09:30:00');
INSERT INTO Shifts(shift_id, start_at, end_at) VALUES (2, '09:30:00', '11:30:00');
INSERT INTO Shifts(shift_id, start_at, end_at) VALUES (3, '13:30:00', '15:30:00');
INSERT INTO Shifts(shift_id, start_at, end_at) VALUES (4, '15:30:00', '17:30:00');

INSERT INTO Admins (admin_id, fullname, gender, dob, account_id) VALUES ('admin', 'Trần Văn Quý', 'Nam','1998-04-01', 6);
INSERT INTO Teachers (teacher_id, fullname, gender, dob, account_id) VALUES ('gv001', 'Trần Văn Quý', 'Nam','1998-04-01', 4);
INSERT INTO Teachers (teacher_id, fullname, gender, dob, account_id) VALUES ('gv002', 'Hồ Tuấn Thanh', 'Nam','1998-04-01', 5);

INSERT INTO Students (student_id, fullname, gender, dob, addr, account_id) VALUES ('18120444', 'Nguyễn Hoàng Sơn', 'Nam', '2000-04-01', 'Bình Phước',  1);
INSERT INTO Students (student_id, fullname, gender, dob, addr, account_id) VALUES ('18120445', 'Lê Danh Lưu', 'Nam', '2000-09-06', 'Đắk Lắk', 2);
INSERT INTO Students (student_id, fullname, gender, dob, addr, account_id) VALUES ('18120443', 'Trần Nhật Quang', 'Nam', '2000-05-21', 'Bình Thuận', 3);

INSERT INTO Courses (course_id, subject_id, teacher_id, day_of_week, shift_id, semester_id, room, start_date, course_length_weeks) VALUES ('CS2011', 'OOP', 'gv001', 'Thứ 4', 3, 1, 'F102', '2021-09-06', 12);
INSERT INTO Courses (course_id, subject_id, teacher_id, day_of_week, shift_id, semester_id, room, start_date, course_length_weeks) VALUES ('CS2021', 'CSDL', 'gv002', 'Thứ 5', 1, 2,'F106', '2021-09-06', 12);
INSERT INTO Courses (course_id, subject_id, teacher_id, day_of_week, shift_id, semester_id, room, start_date, course_length_weeks) VALUES ('CS2012', 'OOP', 'gv001', 'Thứ 4', 3, 2, 'F103', '2021-09-06', 12);
INSERT INTO Courses (course_id, subject_id, teacher_id, day_of_week, shift_id, semester_id, room, start_date, course_length_weeks) VALUES ('CS2031', 'HDH', 'gv002', 'Thứ 2', 3, 1, 'E104', '2021-09-06', 12);
INSERT INTO Courses (course_id, subject_id, teacher_id, day_of_week, shift_id, semester_id, room, start_date, course_length_weeks) VALUES ('CS2041', 'MMT', 'gv001', 'Thứ 7', 1, 2, 'F202', '2021-09-06', 12);
INSERT INTO Courses (course_id, subject_id, teacher_id, day_of_week, shift_id, semester_id, room, start_date, course_length_weeks) VALUES ('CS2051', 'CTDLGT', 'gv002', 'Thứ 3', 4, 2, 'E305', '2021-09-06', 12);
INSERT INTO Courses (course_id, subject_id, teacher_id, day_of_week, shift_id, semester_id, room, start_date, course_length_weeks) VALUES ('SE2111', 'DAAS', 'gv001', 'Thứ 4', 2, 2, 'E204', '2021-09-06', 12);
INSERT INTO Courses (course_id, subject_id, teacher_id, day_of_week, shift_id, semester_id, room, start_date, course_length_weeks) VALUES ('CS2121', 'NMHM', 'gv002', 'Thứ 6', 3, 2, 'G102', '2021-09-06', 12);

