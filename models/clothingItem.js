const mongoose = require("mongoose");
const  validator = require("validator");

const clothingItemShema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 30,
        
    },
    weather: {
      type: String,
      require: true,
      enum: ['hot', 'warm', 'cold'], 
    },
    imageUrl: {
        type: String,
        require: true,  
      validate: {
      validator(value) {
        return validator.isURL(value);
      }, 
      message: 'You must enter a valid URL',  
    },
},
owner: {
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'user',
  require: true,
},
likes: {
    type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    default: [],
},
createdAt: {
  type: Date,
  default: Date.now,
},

});

module.exports = mongoose.model("item", clothingItemShema);
