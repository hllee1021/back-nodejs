const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
const userSchema = new Schema({
  postUID: [{type:mongoose.SchemaTypes.ObjectId}],
  isDeleted:{type:Boolean , default:false},
  userBody: {
    createdAt: {type:Date, default:Date.now},
    email: {type:String, required:true},
    nickname: {type: String, required:true},
    point:{type:Number, required:true}
  }
});


// Create Model & Export
module.exports = mongoose.model('User', userSchema);