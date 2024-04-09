const router = require("express").Router();
//const { getUsers, createUser, getUserId } = require("../controllers/users");
const { auth } = require('../middlewares/auth');
const { getCurrentUser, updateUser } = require("../controllers/users");

router.use(auth);
// router.get("/", getUsers);
// router.get("/:userId", getUserId);
// router.post("/", createUser);

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);





module.exports = router;
