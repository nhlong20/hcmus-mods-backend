const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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

//   ---------------------------------------------------------------
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error-controller');
const userRouter = require('./routes/user-route');
const courseRouter = require('./routes/course-route');

app.get('/api', async (req,res) => {
    res.status(200).json({
        status: 'success',
        data: "Chào mừng tới khóa học trực tuyến"
    })
})
app.use('/api/user', userRouter)
app.use('/api/course', courseRouter)
// app.use('/feedback', feedbackRouter);

//REDIRECT WRONG URL.
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handler
app.use(globalErrorHandler);

module.exports = app;