const faker = require('@faker-js/faker').faker;
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');

const async = require('async');
const config = require('../utilities/config');

const mongoDb = config.MONGO_URL;
mongoose.set('strictQuery', true);
mongoose
  .connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(console.log('connected db upload'));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongo connection error'));

const createUsers = () => {
  const maxUsers = 100;
  let numUsers = 0;
  while (numUsers <= maxUsers) {
    console.log('user', numUsers);
    registerUser();
    numUsers++;
  }
  console.log('done');
};

function registerUser() {
  const userId = new mongoose.Types.ObjectId();
  const password = faker.internet.password();
  const username = faker.internet.userName();
  const email = faker.internet.email();
  const website = faker.internet.url();
  const bio = faker.hacker.phrase();
  const avatar = faker.image.people(300, 300, true);

  User.register(
    new User({
      _id: userId,
      username: username,
      email: email,
      website: website,
      bio: bio,
      isModerator: false,
      avatar: avatar,
    }),
    password,
    function (err, msg) {
      if (err) {
        console.log(err);
      } else {
        console.log(msg);
      }
    }
  );
}

createUsers();
