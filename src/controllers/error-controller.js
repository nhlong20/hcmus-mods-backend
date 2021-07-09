const AppError = require('./../utils/appError');
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = err => {
    // const value = err.detail.match(/(["'])(?:\\.|[^\\])*?\1/);
    const message = `record is already existed`;
    return new AppError(message, 400);
};
const handleVioletForeignKeyDB = err => {
    const message = `your data violates foreign key constraint`;
    return new AppError(message, 400);
};
const handleValidatorErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const sendErrorProd = (err, res) => {
    // Operational Error
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // Unknown Error
    else {
        console.error('ERROR:0:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
};
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
            sendErrorProd(error, res);
        }
        if (err.code === "23505") {
            error = handleDuplicateFieldsDB(error);
            sendErrorProd(error, res);
        }
        if (err.code === "23503") {
            error = handleVioletForeignKeyDB(error);
            sendErrorProd(error, res);
        }
        if (error.name === 'ValidationError') {
            error = handleValidatorErrorDB(error);
            sendErrorProd(error, res);
        }

        sendErrorProd(err, res);
    }
};
