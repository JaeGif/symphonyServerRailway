const express = require('express');
const app = express();
const config = require('./utilities/config');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const User = require('./models/User');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');
const roomsRouter = require('./routes/rooms');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

app.use(
  session({
    secret: config.SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
const auth = require('./middleware/auth.js')();

const mongoDb = config.MONGO_URL; // DO NOT PUSH Mongo_DEV_URL
mongoose.set('strictQuery', true);
mongoose
  .connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(console.log('mongo connected'));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// passport.js config
app.use(auth.initialize());
passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRouter);
app.use('/api', usersRouter);
app.use('/api', messagesRouter);
app.use('/api', roomsRouter);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true,
  },
});
const orderHandler = require('./handlers/orderHandler');
const onConnection = (socket) => {
  console.log('User connected to', socket.id);
  orderHandler(io, socket);
};
io.on('connection', (socket) => onConnection(socket));

server.listen(config.PORT, () => {
  console.log('listening on 3001');
});

module.exports = { server };
