const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const app = express();

// --------------------------------------------------------------
app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Something went wrong' });
});

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//   ---------------------------------------------------------------
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error-controller');
const userRouter = require('./routes/user-route');
const courseRouter = require('./routes/course-route');
const subjectRouter = require('./routes/subject-route');


app.use(compression());

app.get('/api', async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: 'Chào mừng tới khóa học trực tuyến'
    });
});
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/subjects', subjectRouter);

//REDIRECT WRONG URL.
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handler
app.use(globalErrorHandler);

module.exports = app;
