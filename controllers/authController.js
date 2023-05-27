const express = require('express'),
  User = require('../models/User'),
  jwt = require('jwt-simple');
const { mongoose } = require('mongoose');
const fs = require('fs');

exports.login = async function (req, res) {
  console.log(req.body);
  User.findOne({ username: req.body.username })
    .then((user) => {
      console.log(user);
      const payload = {
        id: user._id,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7, //7 days
      };
      const token = jwt.encode(payload, process.env.JWT_SECRET);
      res.json({
        token: token,
        user: user._id,
      });
    })
    .catch((err) => {
      res.sendStatus(401);
      console.log(err);
    });
};

exports.register = function (req, res) {
  const { username, password, email, isModerator } = req.body;
  const userId = new mongoose.Types.ObjectId();

  User.register(
    new User({
      _id: userId,
      username: username,
      email: email || '',
      website: '',
      bio: '',
      isModerator: isModerator || false,
      avatar: 'https://jaesymphonyreal.s3.amazonaws.com/guest-face.svg',
    }),
    password,
    function (err, msg) {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    }
  );
};
