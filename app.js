const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const { getItems } = require('./controllers/clothingItems');
const { login, createUser } = require('./controllers/users');
const app = express();
const cors = require("cors");
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors()); 

// app.use((req, res, next) => {
//   req.user = {
//     _id: "5d8b8592978f8bd833ca8133",
//   };
//   next();
// });
app.post('/signin', login);
app.post('/signup', createUser);

app.use(routes);
app.get("/items", getItems);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
