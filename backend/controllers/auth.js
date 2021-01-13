const Joi = require("joi");

const HttpStatus = require("http-status-codes");

const User = require("../models/userModels");
const Helpers = require("../Helpers/helpers");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbConfig = require("../config/secret");

module.exports = {
  async createUser(req, res) {
    const schema = Joi.object().keys({
      username: Joi.string().min(5).max(10).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
    });

    const { error, value } = schema.validate(req.body);
    console.log(value);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }

    const userEmail = await User.findOne({
      email: Helpers.lowerCase(req.body.email),
    });
    if (userEmail) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: "Email already exist" });
    }

    const userName = await User.findOne({
      username: Helpers.firstUpper(req.body.username),
    });
    if (userName) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: "Username already exist" });
    }

    return bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "error hashing password" });
      }

      const body = {
        username: Helpers.firstUpper(req.body.username),
        email: Helpers.lowerCase(req.body.email),
        password: hash,
      };

      User.create(body)
        .then((user) => {
          const token = jwt.sign({ data: user }, dbConfig.secret, {
            expiresIn: "1h",
          });
          res.cookie("auth", token);

          res
            .status(HttpStatus.CREATED)
            .json({ message: "User Created successfully", user, token });
        })
        .catch((err) => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "error occured" });
        });
    });

    //console.log("hello dear");
    //console.log(req.body);
  },

  async LoginUser(req, res) {
    console.log(req.body);

    if (!req.body.username || !req.body.password) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "hi No empty fields allowed" });
    }

    await User.findOne({ username: Helpers.firstUpper(req.body.username) })
      .then((user) => {
        if (!user) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: "Username not found" });
        }

        return bcrypt
          .compare(req.body.password, user.password)
          .then((result) => {
            if (!result) {
              return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "password is incorrect" });
            }
            const token = jwt.sign({ data: user }, dbConfig.secret, {
              expiresIn: "1h",
            });
            res.cookie("auth", token);
            return res
              .status(HttpStatus.OK)
              .json({ message: "login successful", user, token });
          });
      })
      .catch((err) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occured" });
      });
  },
};
