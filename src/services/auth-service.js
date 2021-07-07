const jwtHelper = require('../utils/jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const pool = require('../database')

const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-example';

let isAuth = catchAsync(async (req, res, next) => {
    // Getting token and check token's existance
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return next(new AppError('You are not logged in!', 401));
    }
    const bearer = bearerHeader.split(' ');
    const accessTokenFromClient = bearer[1];

    // 2 - Verification token
    const decoded = await jwtHelper.verifyToken(
        accessTokenFromClient,
        accessTokenSecret
    );
    // 3 - Check if user still exists
    let queryString = "SELECT * FROM accounts WHERE account_id = $1";
    const currentUser = await pool.query(queryString, [decoded.user.account_id]);
    if (!currentUser) {
        return next(new AppError('Unauthorized', 401));
    }
    // 4 - Check if user changed password after the token was issued (Not done yet)
    req.payload = decoded;
    next();
});

module.exports = {
    isAuth
}