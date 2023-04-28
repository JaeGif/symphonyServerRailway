const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const fs = require('fs');
const api = supertest(app.server);
const User = require('../models/User');

const registerUser = {
  firstName: 'John',
  lastName: 'Register',
  username: 'RegisterCheck',
  isModerator: false,
  avatar: '',
  password: 'superSecretPass66',
};

// delete users from test base, then reinit a new user
beforeEach(async () => {
  await User.findOneAndDelete({ username: 'RegisterCheck' });
});

test('User can be registered and logged in successfully', async () => {
  await api.post('/register').send(registerUser).expect(200);
  const res = await api
    .post('/login')
    .send({ password: registerUser.password, username: registerUser.username })
    .expect(200);
  expect(res.body).toHaveProperty('token');
  expect(res.body).toHaveProperty('user');
});
afterAll(async () => {
  await mongoose.connection.close();
  fs.rmSync('./public/TESTuploads', { recursive: true, force: true });
});
