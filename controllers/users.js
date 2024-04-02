const User = require("../models/user");
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "The request was sent to a non-existent address" });
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }

      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "The request was sent to a non-existent address" });
      }  if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid ID"  });
      }  
        return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
      
    });
};

module.exports = { getUsers, createUser, getUserId };
