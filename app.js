const express = require('express');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const mainRoutes = require('./modules/mainRoutes');
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use('/api', mainRoutes);

module.exports = app;
