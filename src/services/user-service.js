const bcrypt = require('bcryptjs')

exports.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
exports.validPassword = function (inputPwd, userPwd) {
  return bcrypt.compareSync(inputPwd, userPwd);
};

