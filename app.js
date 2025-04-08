const express = require('express');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const mainRoutes = require('./modules/mainRoutes');
const { HttpStatusCode } = require('axios');
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use('/api', mainRoutes);

// app.use((err, req, res, next) => {
//   console.error('ERROR:', err);
//   res.status(err.StatusCode || 500).json({
//     status: 'error',
//     message: err.message && 'something went wrong :('
//   });
// });

module.exports = app;
