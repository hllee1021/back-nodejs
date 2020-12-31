const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
const userSchema = new Schema({
  userID: {type:String},
  userBody: {
    createdAt: String,
    email: String,
    nickname: String,
    point:Number,
    posts:[String]
  }
});


// Create Model & Export
module.exports = mongoose.model('User', userSchema);