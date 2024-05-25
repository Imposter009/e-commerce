const passport = require('passport');

exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt');
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  //TODO : this is temporary token for testing without cookie
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzMzYzk3ODg2MjE5NWMyZGI3ZmI2YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxNTQzNzQzMX0.-MnyjdgHb8-a0T_sDsrc8Z7tXlMqPwwjkC6mmQ2QiU4"
  return token;
};
