require("dotenv").config();

const {
  JWT_SECRET = "31109b1c035b0ba5c38ccd9152b659d2b9d1a653b532f6d8da7ef21fc886c6e0",
} = process.env;

module.exports = { JWT_SECRET };
