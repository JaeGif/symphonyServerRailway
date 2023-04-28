const express = require('express'),
  User = require('../models/User'),
  jwt = require('jwt-simple');
const { mongoose } = require('mongoose');
const fs = require('fs');

exports.user_get = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  user ? res.json({ user }).status(200) : res.sendStatus(400);
};
exports.users_get = async (req, res, next) => {
  let { q, l } = req.query;
  let limit = l || 5;
  let query = q || null;

  if (query) {
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
    }).limit(limit);
    users ? res.json({ users }).status(200) : res.sendStatus(400);
  } else {
    const users = await User.find({});
    users ? res.json({ users }).status(200) : res.sendStatus(400);
  }
};
exports.user_put = async (req, res, next) => {
  let { order, user, room, bio, website, email, avatar } = req.body;
  user = user || null;
  room = room || null;
  let updateFields = {};

  switch (order) {
    case 'userLeaving':
      try {
        const userDoc = await User.findByIdAndUpdate(user, {
          $pull: { rooms: room },
        });
        if (userDoc) {
          return res
            .json({
              message: `User successsfully removed from ${room}`,
            })
            .status(200);
        } else {
          res.sendStatus(404);
        }
      } catch (error) {
        throw new Error(error);
      }
    case 'userJoining':
      try {
        const userDoc = await User.findByIdAndUpdate(user, {
          $push: { rooms: room },
        });
        if (userDoc) {
          return res
            .json({ message: `Successfully joined ${room}` })
            .status(200);
        } else {
          return res.sendStatus(404);
        }
      } catch (error) {
        throw new Error(error);
      }
    case 'updateUser':
      if (bio) updateFields.bio = bio;
      if (email) updateFields.email = email;
      if (website) updateFields.website = website;
      if (!bio && !email && !website) res.sendStatus(400);

      try {
        const userDoc = await User.findByIdAndUpdate(req.params.id, {
          $set: updateFields,
        });
        if (userDoc) {
          return res.status(200);
        } else {
          return res.status(404);
        }
      } catch (error) {
        throw new Error(error);
      }
    case 'changeAvatar':
      if (avatar) updateFields.avatar = avatar;
      try {
        const userDoc = await User.findByIdAndUpdate(req.params.id, {
          $set: updateFields,
        });
        if (userDoc) {
          console.log(userDoc);
          return res.status(200);
        } else {
          return res.status(404);
        }
      } catch (error) {
        throw new Error(error);
      }
    default:
      return res.json({ err: 'No order specified' }).status(400);
  }
};
exports.users_username_check = async (req, res, next) => {
  try {
    const users = await User.find({ username: req.body.username });
    if (users.length >= 1) res.sendStatus(409); // username conflict
    else res.sendStatus(200);
  } catch (error) {
    throw new Error(error);
  }
};
