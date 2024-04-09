const router = require("express").Router();
const itemRouter = require("./clothingItems");
const userRouter = require("./users");
const { NOT_FOUND_ERROR } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
// const auth = require('../middlewares/auth');

// router.use(auth);

router.post("/signup", createUser);
router.post("/signin", login);


router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Router not found" });
});

module.exports = router;
