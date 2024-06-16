const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // return res
    //   .status(UNAUTHORIZED_ERROR)
    //   .send({ message: "Authorization Required" });
    return next(new UnauthorizedError("Authorization Required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    // return res
    //   .status(UNAUTHORIZED_ERROR)
    //   .send({ message: "Authorization Required" });
    return next(new UnauthorizedError("Authorization Required"));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
