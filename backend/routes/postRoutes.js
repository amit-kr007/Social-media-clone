const express = require("express");
const router = express.Router();

const PostCtrl = require("../controllers/posts");
const AuthHelper = require("../Helpers/AuthHelpers");
const AuthHelpers = require("../Helpers/AuthHelpers");

router.get("/posts", AuthHelpers.VerifyToken, function (req, res) {
  //console.log("postRoutes");
  PostCtrl.GetAllPosts(req, res);
});
router.get("/post/:id", AuthHelpers.VerifyToken, function (req, res) {
  //console.log("postRoutes");
  PostCtrl.GetPost(req, res);
});

router.post("/post/add-post", AuthHelpers.VerifyToken, function (req, res) {
  //console.log(req.body);

  PostCtrl.AddPost(req, res);
  //console.log("yes1");
});

router.post("/post/add-like", AuthHelpers.VerifyToken, function (req, res) {
  //console.log(req.body);

  PostCtrl.AddLike(req, res);
  //console.log("yes1");
});

router.post("/post/add-comment", AuthHelpers.VerifyToken, function (req, res) {
  //console.log(req.body);

  PostCtrl.AddComment(req, res);
  //console.log("yes1");
});

module.exports = router;
