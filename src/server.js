'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

const {authRoute} = require('./controllers/authController');
const {usersRoute} = require('./controllers/usersController');
const {trucksRoute} = require('./controllers/trucksController');
const {loadsRoute} = require('./controllers/loadsController');
const {AppError} = require('./utils/errors');
const {authMiddleware} = require('./middlewares/authMiddleware');
const {
  isDriver,
} = require('./middlewares/roleCheckMiddleware');

app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/auth', authRoute);
app.use('/api/users', [authMiddleware], usersRoute);
app.use('/api/trucks', [authMiddleware, isDriver], trucksRoute);
app.use('/api/loads', [authMiddleware], loadsRoute);

app.use((req, res, next) => {
  res.status(404).json({message: 'Not found'});
});

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({message: err.message});
  }
  res.status(500).json({message: err.message});
});

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    app.listen(PORT);
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
};

start();

// app.use(cors({origin: '*'}));
// app.use(express.static(path.join(__dirname, '/client/build')));
// app.get('*', (req, res) => {
//   return res.sendFile(path.join(__dirname, '/client/build/index.html'));
// });
