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

const createRooms = async () => {
  const users = await findAllUsers();
  let randomUserIdx = [];

  const maxRooms = 100;
  let numRooms = 0;
  while (numRooms <= maxRooms) {
    const randomNumOfUsers = Math.floor(
      Math.random() * (users.length - 1 - 1 + 1) + 1
    );
    const intermediateArr = [];

    for (let i = 0; i <= randomNumOfUsers; i++) {
      const item = users[Math.floor(Math.random() * users.length)];
      intermediateArr.push(item._id);
    }
    randomUserIdx = intermediateArr;

    createRoom(randomUserIdx);
    numRooms++;
  }
  console.log('done');
};
async function findAllUsers() {
  const users = await User.find({});
  return users;
}
async function createRoom(randomUsersIdxArray) {
  const topicsArr = [
    'Generic',
    'Gaming',
    'Club',
    'Study',
    'Friends',
    'Artists',
    'Community',
  ];
  const topic = topicsArr[Math.floor(Math.random() * topicsArr.length)];

  const description = faker.lorem.sentence(3);
  const avatar = faker.image.technics(300, 300, true);
  const title = faker.lorem.sentence(1);
  const room = new Room({
    users: randomUsersIdxArray,
    public: true,
    topic: topic,
    description: description,
    title: title,
    avatar: avatar,
  });
  await room.save();
}
createRooms();
