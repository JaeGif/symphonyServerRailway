const Message = require('../models/Message');
const Room = require('../models/Room');
const messageController = require('../controllers/messageController');
const express = require('express'),
  User = require('../models/User'),
  jwt = require('jwt-simple');
const { mongoose } = require('mongoose');
const fs = require('fs');

module.exports = (io, socket) => {
  const joinRoomOrder = (payload) => {
    console.log('User joined room#:', payload);
    socket.join(payload);
  };
  const sendOrder = (payload) => {
    messageController.saveMessage(payload);
    io.in(payload.room).emit('recieve_message', payload);
  };
  const disconnectOrder = () => {
    console.log(`User disconnected from ${socket.id}`);
  };

  socket.on('join_room', joinRoomOrder);
  socket.on('disconnect', disconnectOrder);
  socket.on('send_message', sendOrder);
};
