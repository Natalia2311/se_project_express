const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError, 
  NotFoundError, 
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");
//const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Invalid data"));
     return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("An email address that already exists on the server");
        
      }
   
    return bcrypt.hash(password, 10)
    .then((hash) => {
       User.create({ name, avatar, email, password: hash })

        .then((newUser) => {
          const payload = newUser.toObject();
          delete payload.password;
          res.status(201).send({ data: payload });
        });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
         next (new BadRequestError("Invalid ID"));
      } else {
        next(err);
       }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Invalid data"));
     return;
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
       next (new UnauthorizedError("An incorrect email or password"));
      }

      if (err.name === "DocumentNotFoundError") {
         next(new BadRequestError("Invalid data"));
      } else {
        next(err);
       }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
         next (new NotFoundError("There is no user with the requested id"));
      }
      if (err.name === "CastError") {
         next (new BadRequestError("Invalid ID"));
      } else {
        next(err);
       }
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
         next (new NotFoundError("There is no user with the requested id"));
      }
      if (err.name === "ValidationError") {
         next(new BadRequestError("Invalid data"));
      } else {
        next(err);
       }
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
