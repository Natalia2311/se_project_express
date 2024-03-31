const User = require("../models/user");
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, SERVER_ERROR } = require('../utils/errors');


const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
    if (err.name === 'CastError') {
  return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
}
if (err.name === 'DocumentNotFoundError') {
 return res.status(NOT_FOUND_ERROR).send({ message: err.message });
} 
return res.status(SERVER_ERROR).send({ message: err.message });

});
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
    if (err.name === 'ValidationError') {
  return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
}

return res.status(SERVER_ERROR).send({ message: err.message });

});

  };

  const getUserId = (req, res) => {
  const { userId } = req.params; 
    User.findById(userId)
    .orFail()
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        console.error(err);
        console.log(err.name);
        if (err.name === "ValidationError") {
          return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
        }
        if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
        } 
        return res.status(SERVER_ERROR).send({ message: err.message });
        
        });
};

module.exports = { getUsers, createUser, getUserId };


