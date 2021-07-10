const { promisify } = require('util');
const jwt = require('jsonwebtoken');
/**
 * private function generateToken
 * @param data
 * @param secretSignature
 * @param tokenLife
 */
let generateToken = (userData, privateKey, tokenLife) => {
    try {
        let payload = { user: userData};
        let signOptions = {
            issuer: 'Hcmus Mods',
            algorithm: 'HS256',
            expiresIn: tokenLife
        };
        // jwt.sign return a Promise
        let token = jwt.sign(payload, privateKey, signOptions);
        return token;
    } catch (err) {
        return new Error(err);
    }
};
/**
 * This module used for verify jwt token
 * @param {*} token
 * @param {*} secretKey
 */
let verifyToken = async (token, secretKey) => {
    return await promisify(jwt.verify)(token, secretKey);
};

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken
};
