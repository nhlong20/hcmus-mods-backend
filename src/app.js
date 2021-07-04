const path = require('path');
const express = require('express');
// const mongoose = require('mongoose');
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
// app.use('/user', userRouter);
// app.use('/feedback', feedbackRouter);

//REDIRECT WRONG URL.
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// // error handler
// app.use(globalErrorHandler);

module.exports = app;