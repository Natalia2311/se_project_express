const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { 
  validateCardBody,
  validateId,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.use(auth);

router.post("/", validateCardBody, createItem);

router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId", validateId, deleteItem);
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
