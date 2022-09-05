const express = require("express");
const router = express.Router();
const User = require("../models/userDatabase");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");

const { OAuth2Client } = require("google-auth-library");

//recives from frontend
const client = new OAuth2Client(process.env.CLIENT_ID);

var salt = bcrypt.genSaltSync(10);
require("../auth/passport");

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(morgan("combined"));

router.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});

router.post("/register", async (req, res, next) => {
  await User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        console.log(user);
        res.setHeader("Content-Type", "Application/JSON");
        res.status(400).json({
          message: "The following username is already registered",
          username: req.body.username,
        });
      }
      var hash = bcrypt.hashSync(req.body.password, salt);
      console.log(hash);
      new User({
        username: req.body.username,
        password: hash,
        email: req.body.email,
      })
        .save()
        .then((user) => {
          const token = jwt.sign(
            { username: user.username, password: user.password, _id: user._id },
            "your_jwt_secret"
          );
          res.setHeader("Content-Type", "Application/JSON");
          res.json({
            name: user.username,
            token: token,
            profilePic: "",
            // message: "Successfully registered",
          });
          // console.log(user);
        })
        .catch((err) => {
          res.status(400).json({ message: "Unexpected server error" });
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

/* POST login. */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log(err || !user);
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user, "your_jwt_secret");
      return res.json({ user, token });
    });
  })(req, res);
});

router.post("/googleLogin", async (req, res, next) => {
  const { tokenId } = req.body;
  // recieved from frontend

  client
    .verifyIdToken({
      idToken: tokenId,
      requiredAudience: process.env.CLIENT_ID,
    })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      console.log(response.payload);
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              error: "Something Went Wrong",
            });
          } else {
            if (user) {
              //exists in database
              const token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "10d" }
              );
              const { _id, email, name } = user;

              res.json({
                token,
                user: { _id, email, name },
              });
            } else {
              let password = email + process.env.JWT_SECRET;
              //does not exist in database
              let newUser = new User({
                email: email,
                username: name,
                password: password,
              });

              newUser.save((err, user) => {
                if (err) {
                  console.log(err);
                  return res.status(400).json({
                    error: "Something Went Wrong",
                  });
                } else {
                  const token = jwt.sign(
                    { _id: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "10d" }
                  );
                  const { _id, email, name } = user;
                  res.json({
                    token,
                    user: { _id, email, name },
                  });
                }
              });
            }
          }
        });
      }
    });
  console.log();
});

module.exports = router;
