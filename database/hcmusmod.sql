DROP TABLE IF EXISTS Accounts CASCADE;
DROP TABLE IF EXISTS Teachers CASCADE;
DROP TABLE IF EXISTS Moderators CASCADE;
DROP TABLE IF EXISTS Admin CASCADE;
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
  account_id SERIAL NOT NULL);
CREATE TABLE Teachers (
  teacher_id SERIAL NOT NULL, 
  account_id int4 NOT NULL);
CREATE TABLE Moderators (
  moderator_id SERIAL NOT NULL, 
  account_id   int4 NOT NULL);
CREATE TABLE Admin (
  admin_id   SERIAL NOT NULL, 
  account_id int4 NOT NULL);
CREATE TABLE Shifts (
  shift_id SERIAL NOT NULL);
CREATE TABLE Subjects (
  subject_id           SERIAL NOT NULL, 
  prerequisite_subject int4 NOT NULL);
CREATE TABLE Student_Course (
  student_id int4 NOT NULL, 
  course_id  int4 NOT NULL);
CREATE TABLE Courses (
  course_id   SERIAL NOT NULL, 
  subject_id  int4 NOT NULL, 
  shift_id    int4 NOT NULL, 
  semester_id int4 NOT NULL, 
  teacher_id  int4 NOT NULL);
CREATE TABLE RegistrationSessions (
  session_id  SERIAL NOT NULL, 
  semester_id int4 NOT NULL);
CREATE TABLE Semesters (
  semester_id SERIAL NOT NULL);
CREATE TABLE Students (
  student_id SERIAL NOT NULL, 
  account_id int4 NOT NULL);
CREATE TABLE Modules (
  module_id SERIAL NOT NULL, 
  course_id int4 NOT NULL);
CREATE TABLE Courseworks (
  coursework_id SERIAL NOT NULL, 
  module_id     int4 NOT NULL);
CREATE TABLE Lectures (
  lecture_id SERIAL NOT NULL, 
  module_id  int4 NOT NULL);
CREATE TABLE Reviews (
  review_id  SERIAL NOT NULL, 
  course_id  int4 NOT NULL, 
  account_id int4 NOT NULL);
CREATE TABLE Comments (
  comment_id SERIAL NOT NULL, 
  topic_id   int4 NOT NULL, 
  account_id int4 NOT NULL);
CREATE TABLE Topics (
  course_id int4 NOT NULL, 
  topic_id  SERIAL NOT NULL);
CREATE TABLE Appendix (
  appendix_id SERIAL NOT NULL, 
  module_id   int4 NOT NULL);


ALTER TABLE Accounts ADD PRIMARY KEY (account_id);
ALTER TABLE Teachers ADD PRIMARY KEY (teacher_id);
ALTER TABLE Moderators ADD PRIMARY KEY (moderator_id);
ALTER TABLE Admin ADD PRIMARY KEY (admin_id);
ALTER TABLE Shifts ADD PRIMARY KEY (shift_id);
ALTER TABLE Subjects ADD PRIMARY KEY (subject_id);
ALTER TABLE Courses ADD PRIMARY KEY (course_id);
ALTER TABLE RegistrationSessions ADD PRIMARY KEY (session_id);
ALTER TABLE Semesters ADD PRIMARY KEY (semester_id);
ALTER TABLE Students ADD PRIMARY KEY (student_id);
ALTER TABLE Modules ADD PRIMARY KEY (module_id);
ALTER TABLE Courseworks ADD PRIMARY KEY (coursework_id);
ALTER TABLE Lectures ADD PRIMARY KEY (lecture_id);
ALTER TABLE Reviews ADD PRIMARY KEY (review_id);
ALTER TABLE Comments ADD PRIMARY KEY (comment_id);
ALTER TABLE Topics ADD PRIMARY KEY (topic_id);
ALTER TABLE Appendix ADD PRIMARY KEY (appendix_id);


ALTER TABLE Courses DROP CONSTRAINT FKCourses897334;
ALTER TABLE Student_Course DROP CONSTRAINT FKStudent_Co291921;
ALTER TABLE RegistrationSessions DROP CONSTRAINT FKRegistrati230755;
ALTER TABLE Courses DROP CONSTRAINT FKCourses593246;
ALTER TABLE Student_Course DROP CONSTRAINT FKStudent_Co197422;
ALTER TABLE Teachers DROP CONSTRAINT FKTeachers775443;
ALTER TABLE Moderators DROP CONSTRAINT FKModerators982878;
ALTER TABLE Admin DROP CONSTRAINT FKAdmin915765;
ALTER TABLE Courses DROP CONSTRAINT FKCourses829257;
ALTER TABLE Courses DROP CONSTRAINT FKCourses726951;
ALTER TABLE Modules DROP CONSTRAINT FKModules578642;
ALTER TABLE Courseworks DROP CONSTRAINT FKCoursework788508;
ALTER TABLE Lectures DROP CONSTRAINT FKLectures99366;
ALTER TABLE Subjects DROP CONSTRAINT FKSubjects343910;
ALTER TABLE Reviews DROP CONSTRAINT FKReviews59454;
ALTER TABLE Topics DROP CONSTRAINT FKTopics865970;
ALTER TABLE Students DROP CONSTRAINT FKStudents507314;
ALTER TABLE Comments DROP CONSTRAINT FKComments27586;
ALTER TABLE Comments DROP CONSTRAINT FKComments444776;
ALTER TABLE Appendix DROP CONSTRAINT FKAppendix764589;
ALTER TABLE Reviews DROP CONSTRAINT FKReviews562743;

ALTER TABLE Courses ADD CONSTRAINT FKCourses897334 FOREIGN KEY (subject_id) REFERENCES Subjects (subject_id);
ALTER TABLE Student_Course ADD CONSTRAINT FKStudent_Co291921 FOREIGN KEY (course_id) REFERENCES Courses (course_id);
ALTER TABLE RegistrationSessions ADD CONSTRAINT FKRegistrati230755 FOREIGN KEY (semester_id) REFERENCES Semesters (semester_id);
ALTER TABLE Courses ADD CONSTRAINT FKCourses593246 FOREIGN KEY (shift_id) REFERENCES Shifts (shift_id);
ALTER TABLE Student_Course ADD CONSTRAINT FKStudent_Co197422 FOREIGN KEY (student_id) REFERENCES Students (student_id);
ALTER TABLE Teachers ADD CONSTRAINT FKTeachers775443 FOREIGN KEY (account_id) REFERENCES Accounts (account_id);
ALTER TABLE Moderators ADD CONSTRAINT FKModerators982878 FOREIGN KEY (account_id) REFERENCES Accounts (account_id);
ALTER TABLE Admin ADD CONSTRAINT FKAdmin915765 FOREIGN KEY (account_id) REFERENCES Accounts (account_id);
ALTER TABLE Courses ADD CONSTRAINT FKCourses829257 FOREIGN KEY (semester_id) REFERENCES Semesters (semester_id);
ALTER TABLE Courses ADD CONSTRAINT FKCourses726951 FOREIGN KEY (teacher_id) REFERENCES Teachers (teacher_id);
ALTER TABLE Modules ADD CONSTRAINT FKModules578642 FOREIGN KEY (course_id) REFERENCES Courses (course_id);
ALTER TABLE Courseworks ADD CONSTRAINT FKCoursework788508 FOREIGN KEY (module_id) REFERENCES Modules (module_id);
ALTER TABLE Lectures ADD CONSTRAINT FKLectures99366 FOREIGN KEY (module_id) REFERENCES Modules (module_id);
ALTER TABLE Subjects ADD CONSTRAINT FKSubjects343910 FOREIGN KEY (prerequisite_subject) REFERENCES Subjects (subject_id);
ALTER TABLE Reviews ADD CONSTRAINT FKReviews59454 FOREIGN KEY (course_id) REFERENCES Courses (course_id);
ALTER TABLE Topics ADD CONSTRAINT FKTopics865970 FOREIGN KEY (course_id) REFERENCES Courses (course_id);
ALTER TABLE Students ADD CONSTRAINT FKStudents507314 FOREIGN KEY (account_id) REFERENCES Accounts (account_id);
ALTER TABLE Comments ADD CONSTRAINT FKComments27586 FOREIGN KEY (account_id) REFERENCES Accounts (account_id);
ALTER TABLE Comments ADD CONSTRAINT FKComments444776 FOREIGN KEY (topic_id) REFERENCES Topics (topic_id);
ALTER TABLE Appendix ADD CONSTRAINT FKAppendix764589 FOREIGN KEY (module_id) REFERENCES Modules (module_id);
ALTER TABLE Reviews ADD CONSTRAINT FKReviews562743 FOREIGN KEY (account_id) REFERENCES Accounts (account_id);
