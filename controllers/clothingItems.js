const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} = require("../utils/errors.js");

const createItem = (req, res, next) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })

    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
         next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})

    .then((items) => res.status(200).send(items))

    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
         next(new NotFoundError( "Invalid ID"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError("The user is trying to remove the card of another user");
      
      }

      ClothingItem.deleteOne({ _id: req.params.itemId })
        .orFail()
        .then(() => res.status(200).send({ message: "Item deleted" }));
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
         next(new NotFoundError( "There is no clothing item with the requested id"));
      }
      if (err.name === "CastError") {
         next(new NotFoundError("Invalid ID"));
      } else {
        next(err);
      }
    
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
       next (new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
         next (new NotFoundError("The request was sent to a non-existent address"));
      
      } else {
          next(err);
         }
    });
};

const dislikeItem = (req, res, next) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
         next (new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        next (new NotFoundError("The request was sent to a non-existent address"));
      } else {
        next(err);
       }
     
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};

