const User = require("../models/user");
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  UNAUTHORIZED_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");
const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../utils/config');

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => {
//       console.error(err);
      
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND_ERROR).send({ message: "The request was sent to a non-existent address" });
//       }
//       return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
//     });
// };

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid ID" });
  };
  User.findOne({ email })
  .select("+password")
    .then((user) => {
      if (user) {
        const error = new Error("Duplicate user");
        error.statusCode = CONFLICT_ERROR;
        throw error;
      }
      return bcrypt.hash(password, 10);
})
    .then((hash) => {
    return User.create({ name, avatar, email, password: hash })
    
    .then((user) => {
      const payload = user.toObject();
      delete payload.password;
      res.status(201).send({ data: payload });
    })
   }).catch((err) => {
            console.error(err);
            if (err.name === "Duplicate user") {
              return res.status(CONFLICT_ERROR).send({ message: "An email address that already exists on the server" });
            }
      
            if (err.name === "ValidationError") {
              return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid ID" });
            }
      
            return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
      });
    };


  const login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" }); 
      } 
    return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "Incorrect email or password") {
        return res.status(UNAUTHORIZED_ERROR).send({ message: "An incorrect email or password" });
      } 
      // if (!email || !password) {
      //   return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" }); 
      // }
      // if (err.name === "DocumentNotFoundError") {
      //   return res.status(NOT_FOUND_ERROR).send({ message: "The request was sent to a non-existent address" });
      // } 
      
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
  };

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
  .orFail()
  .then((user) => res.status(201).send({ user }))
  .catch((err) => {
    console.error(err);

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND_ERROR).send({ message: "The request was sent to a non-existent address" });
    }  if (err.name === "CastError") {
      return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid ID"  });
    }  
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    
  });
}


const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name: name, avatar: avatar },
    { new: true, runValidators: true},
  )
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    console.error(err);

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND_ERROR).send({ message: "The request was sent to a non-existent address" });
    }  if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid ID"  });
    }  
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    
  });
};



// const getUserId = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       console.error(err);

//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND_ERROR).send({ message: "The request was sent to a non-existent address" });
//       }  if (err.name === "CastError") {
//         return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid ID"  });
//       }  
//         return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
      
//     });
// };

module.exports = { createUser, login, getCurrentUser, updateUser };
