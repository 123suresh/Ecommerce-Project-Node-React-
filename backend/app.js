const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/error');

app.use(express.json());

// Import all routes
const products = require('./routes/product');

app.use('/api/v1', products)

//MiddleWare to handle error
app.use(errorMiddleware);

module.exports = app;