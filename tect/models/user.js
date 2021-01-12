const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
const userSchema = new Schema({
  userBody: {
    authorID: {type: String, required:true},  //firebase uid 사용하면 될 듯 
    email: {type:String, required:true},
    authorNickname: {type: String, trim:true, required:true},
    postID: [{type:mongoose.SchemaTypes.ObjectId}],
    isDeleted:{type:Boolean , default:false},
    createdAt: {type:Date, default:Date.now},
    point:{type:Number, required:true}
  }
});


// Create Model & Export
module.exports = mongoose.model('User', userSchema);