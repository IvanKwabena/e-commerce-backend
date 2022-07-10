const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// import routers
const productRouter = require('./routes/product-route');
const categoryRouter = require('./routes/category-route');
const userRouter = require('./routes/user-route');
const oderRouter = require('./routes/order-route');
const { authJwt } = require('./helpers/jwt');
const errorHandler = require('./helpers/error_handler');

const apiUrl = process.env.API_URL;
const app = express();

// middlewares
app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(`${__dirname}/public/uploads`)); // 

app.use(`${apiUrl}/products`, productRouter);
app.use(`${apiUrl}/categories`, categoryRouter);
app.use(`${apiUrl}/users`, userRouter);
app.use(`${apiUrl}/orders`, oderRouter);

// Port and database connection
// Connection to db
mongoose
  .connect(process.env.MONGO_APIKEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'e-commerce',
  })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log(err);
  });

// port to listen
app.listen(7000, () => {
  console.log('Server running at http://localhost:7000/');
});
