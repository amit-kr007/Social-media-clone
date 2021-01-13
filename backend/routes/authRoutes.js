const express = require("express");
const router = express.Router();

const AuthCtrl = require("../controllers/auth");

router.post("/register", function (req, res) {
  //console.log(req.body);

  AuthCtrl.createUser(req, res);
});

router.post("/login", function (req, res) {
  //console.log(req.body);

  AuthCtrl.LoginUser(req, res);
});
module.exports = router;
