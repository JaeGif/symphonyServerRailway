require('dotenv').config();

const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_REGION = process.env.AWS_REGION;

const MONGO_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_TEST_URL_v2
    : process.env.MONGO_DEV_URL;

module.exports = {
  MONGO_URL,
  PORT,
  SECRET,
  AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
};
