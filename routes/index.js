const router = require("express").Router();
const itemRouter = require("./clothingItems");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const { validateUser, validateLogin } = require("../middlewares/validation");

router.post("/signup", validateUser, createUser);
router.post("/signin", validateLogin, login);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(new NotFoundError("Router not found"));
});

module.exports = router;
