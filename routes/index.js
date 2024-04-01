const router = require("express").Router();
const itemRouter = require("./clothingItems");
const userRouter = require("./users");
const { SERVER_ERROR } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(SERVER_ERROR).send({ message: "Router not found" });
});

module.exports = router;
