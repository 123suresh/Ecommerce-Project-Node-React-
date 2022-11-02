const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/error');

app.use(express.json());

// Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');

app.use('/api/v1', products)
app.use('/api/v1',auth)
app.use('/api/v1',order)

//MiddleWare to handle error
app.use(errorMiddleware);

module.exports = app;