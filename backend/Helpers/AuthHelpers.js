const jwt = require("jsonwebtoken");
const HttpStatus = require("http-status-codes");
const dbConfig = require("../config/secret");

module.exports = {
  VerifyToken: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "No Author" });
    }
    const token = req.cookies.auth || req.headers.authorization.split(" ")[1];
    //console.log(token);
    //console.log(req.headers);

    if (!token) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "  No token provided" });
    }
    return jwt.verify(token, dbConfig.secret, (err, decoded) => {
      if (err) {
        //console.log("yes");
        if (err.expiredAt < new Date()) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Token has expired please Login again",
            token: null,
          });
        }
        next();
      }
      req.user = decoded.data;
      next();
    });
  },
};