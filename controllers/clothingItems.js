 const ClothingItem = require('../models/clothingItem');

 const creatItem = (req, res) => {
    console.log(req.user._id);
    const {name, weather, imageUrl} = req.body;
    
    ClothingItem.create({ name, weather, imageUrl, owner: req.user._id }).then((item) => {
   
        res.send({data:item})
    }).catch((err) => {
        
        res.status(500).send({message: 'Error from createItem', err})
    });

 };

const getItems = (req, res) => {
    ClothingItem.find({}).then((items) => res.status(200).send(item))
    .catch((err) => {
        res.status(500).send({message:'Error from getItems', err});
    })
}

const updateItem = (req, res) => {
 const {itemId} = req.param;
 const {imageUrl} = req.body;
 
 ClothingItem.findByIdAndUpdate(itemId, {$set: {imageUrl}}).orFail().then((item) => res.status(200).send({data:item}))
 .catch((err) => {
    res.status(500).send({message:'Error from updateItem', err});
 
 })
}

const deleteItem = (req, res) => {
    const {itemId} = req.param;

    ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((err) => {
       res.status(500).send({message:'Error from deleteItem', err});
    
    });
   };


 module.exports = { creatItem, getItems, updateItem, deleteItem }; 

