require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const { errorHandler }= require('./middlewares/errorHandler');
const { errors } = require('celebrate');
const  {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

  app.get('/crash-test', () => {
    setTimeout(() => {
      throw new Error('Server will crash now');
    }, 0);
  });

  app.use(requestLogger);

app.use(express.json());
app.use(cors());
app.use(routes);
app.use(errorLogger);
app.use(errors());

// app.use((err, req, res, next) => {
//   console.error(err);
//   return res.status(500).send({ message: 'An error occurred on the server' });
// });
app.use(errorHandler);
// app.use((err, req, res, next) => {
//   console.error(err);
//   // if an error has no status, set it to 500
//   const { statusCode = 500, message } = err;
//   res
//     .status(statusCode)
//     .send({
//       // check the status and display a message based on it
//       message: statusCode === 500
//         ? 'An error occurred on the server'
//         : message
//     });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
