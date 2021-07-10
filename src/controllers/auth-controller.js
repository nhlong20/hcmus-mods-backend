'use strict';
const catchAsync = require('../utils/catchAsync');
const jwthelper = require('../utils/jsonwebtoken');
const AppError = require('./../utils/appError');
const userServ = require('../services/user-service');
const reviewServ = require('../services/review-service');

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '1h';
const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-example';

const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '3650d';
const refreshTokenSecret =
    process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret-example';

const createSendToken = (user, statusCode, req, res) => {
    const token = jwthelper.generateToken(
        {
            account_id: user.account_id,
            acc_type: user.acc_type,
            username: user.username
        },
        accessTokenSecret,
        accessTokenLife
    );
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    // Remove password from output
    user.passwd = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    // hash password
    const { username, password, acc_type, fullname, gender, dob, phone, addr } =
        req.body;

    if (!username || !password || !acc_type) {
        return next(new AppError('Please provide user and password!', 400));
    }

    // Check exíting account
    const record = await userServ.getOneByUsername({ acc_type, username });

    if (record && record.length !== 0) {
        return next(new AppError('Account is already existed', 400));
    }

    const account = await userServ.createAccount(acc_type, username, password);
    const userData = {
        username,
        acc_type: acc_type.toLowerCase(),
        account_id: account.account_id,
        fullname,
        gender,
        dob,
        phone,
        addr
    };
    console.log(userData);
    const userInfo = await userServ.createOne(userData);

    createSendToken(
        {
            ...account,
            ...userInfo
        },
        200,
        req,
        res
    );

    res.status(201).json({
        status: 'success',
        data: {
            new_user: {
                ...account,
                ...userInfo
            }
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { acc_type, username, password } = req.body;
    if (!username || !password) {
        return next(new AppError('Please provide user and password!', 400));
    }

    const record = await userServ.getOneByUsername({ acc_type, username });
    if (
        !record ||
        record.length === 0 ||
        !(await userServ.validPassword(password, record.passwd))
    ) {
        return next(new AppError('Incorrect email or password', 401));
    }

    let user = { ...record };
    createSendToken(user, 200, req, res);

    // The code below is used when we forgot password
    // const refreshToken = await jwthelper.generateToken(
    //     {
    //         account_id: user.account_id,
    //         role: user.acc_type,
    //         username: user.username
    //     },
    //     refreshTokenSecret,
    //     refreshTokenLife
    // );
    // // Update refresh_token in db
    // let sql = 'UPDATE Accounts SET refresh_token = $1 WHERE account_id = $2';
    // await pool.query(sql, [refreshToken, user.account_id]);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
    // Getting token and check token's existance
    let token = null;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access.',
                401
            )
        );
    }

    // 2 - Verification token
    const decoded = await jwthelper.verifyToken(token, accessTokenSecret);
    // 3 - Check if user still exists
    const user = await userServ.getAccount(decoded.user.account_id);
    if (!user) {
        return next(new AppError('Unauthorized or token is expired', 401));
    }
    const currentUser = await userServ.getOne({
        acc_type: user.acc_type,
        user_id: user.account_id
    });
    currentUser.passwd = undefined;
    // 4 - Check if user changed password after the token was issued (Not done yet)
    req.user = currentUser;
    req.payload = decoded;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'moderator', 'teacher', 'student]
        if (!roles.includes(req.user.acc_type)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403
                )
            );
        }
        next();
    };
};

exports.isReviewOwner = catchAsync(async (req, res, next) => {
    const { review_id } = req.params;
    const review = await reviewServ.getOne(review_id);

    if (!review || review.length === 0) {
        return next(new AppError('No record found with that id', 404));
    }

    if (review.account_id === req.user.account_id) {
        return next();
    }

    return next(
        new AppError(
            'You have no permission to modify review of another user',
            400
        )
    );
});
