const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const fs = require('fs');
const api = supertest(app.server);
const User = require('../models/User');

const id = new mongoose.Types.ObjectId();

const testUser = {
  firstName: 'Test',
  lastName: 'User',
  username: 'Testing',
  isModerator: false,
  avatar: '',
  password: 'superSecretPass22',
  _id: id,
};

// delete users from test base, then reinit a new user
beforeEach(async () => {
  await User.findOneAndDelete({ username: 'RegisterCheck' });
  await api.post('/register').send(testUser);
});

test('User can be fetched by ID', async () => {
  const res = await api.get(`/api/users/${id}`).expect(200);
  // check response type
  expect(res.body).toBe(Array.isArray(res.body)).toBeTruthy();
  expect(res.body.length).toEqual(1);

  // check actual response
  expect(res.body[0]._id).toBe(testUser._id);
  expect(res.body[0].firstName).toBe(testUser.firstName);
  expect(res.body[0].lastName).toBe(testUser.lastName);
  expect(res.body[0].username).toBe(testUser.username);
  expect(res.body[0].isModerator).toBe(testUser.isModerator);
});
afterAll(async () => {
  await mongoose.connection.close();
  fs.rmSync('./public/TESTuploads', { recursive: true, force: true });
});
