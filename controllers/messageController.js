const Message = require('../models/Message');
const Room = require('../models/Room');

const express = require('express'),
  User = require('../models/User'),
  jwt = require('jwt-simple');
const { mongoose } = require('mongoose');
const fs = require('fs');

exports.saveMessage = async (payload) => {
  try {
    const message = new Message({
      _id: payload._id,
      user: {
        _id: payload.user._id,
        username: payload.user.username,
        avatar: payload.user.avatar,
      },
      room: payload.room,
      message: payload.message,
      timestamp: payload.timestamp,
    });

    await message.save();
  } catch (error) {
    throw new Error(error);
  }
};

exports.get_messages = async (req, res, next) => {
  let { room, cursor, returnLimit, userId } = req.query;
  returnLimit = returnLimit || 5;
  cursor = cursor || 0;
  userId = userId || null;

  const skipBy = parseInt(cursor);
  try {
    const messages = await Message.find({ room: room })
      .sort('-createdAt')
      .skip(skipBy)
      .limit(returnLimit);
    let results = [...messages.reverse()];
    if (userId) {
      // takes uID string
      results = results.filter((post) => post.user.toString() === userId);
    }
    console.log(results);
    const nextCursor = parseInt(cursor) + results.length;
    const previousCursor = parseInt(cursor);

    res.json({ messages: results, nextCursor, previousCursor }).status(200);
  } catch (err) {
    res.sendStatus(400);
    throw Error(err);
  }
};

exports.get_message = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    res.json({ message }).status(200);
  } catch (err) {
    throw Error(err);
  }
};
exports.put_message = async (req, res, next) => {
  const { message } = req.body;

  try {
    const messageDoc = await Message.findByIdAndUpdate(req.params.id, {
      $set: {
        message: message,
      },
    });
    messageDoc
      ? res.json({ message: messageDoc }).status(200)
      : res.sendStatus(404);
  } catch (err) {
    throw Error(err);
  }
};
exports.delete_message = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    message ? res.sendStatus(200) : res.sendStatus(404);
  } catch (err) {
    throw Error(err);
  }
};
