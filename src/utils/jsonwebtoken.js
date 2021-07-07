const jwt = require("jsonwebtoken");
/**
 * private function generateToken
 * @param data
 * @param secretSignature
 * @param tokenLife
 */
let generateToken = async (userData, privateKey, tokenLife, admin = false) => {
  try {
    let payload = { user: userData, admin: admin };
    let signOptions = {
      issuer: "Hcmus Mods",
      algorithm: "HS256",
      expiresIn: tokenLife
    }
    // jwt.sign return a Promise
    let token = await jwt.sign(payload, privateKey, signOptions);
    return token;
  } catch (err) {
    return new Error(err);
  }
}
/**
 * This module used for verify jwt token
 * @param {*} token
 * @param {*} secretKey
 */
let verifyToken = (token, secretKey) => { 
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      return resolve(decoded);
    });
  });
}

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};