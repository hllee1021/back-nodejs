const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question= require('./question');
const Answer = require('./answer');
const Comment = require('./comment')

// Define Schemes
// const userSchema = new Schema({
//   userBody: {
//     authorID: {type: String, required:true},  //firebase uid 사용하면 될 듯 
//     email: {type:String, required:true},
//     authorNickname: {type: String, trim:true, required:true},
//     postID: [{type:mongoose.SchemaTypes.ObjectId}],
//     isDeleted:{type:Boolean , default:false},
//     createdAt: {type:Date, default:Date.now},
//     point:{type:Number, required:true}
//   }
// });

const userSchema = new Schema({
  email:{type:String, required:true, unique:true, lowercase:true},
  nickname:{type:String, required:true, unique:true},
  deleted:{type:Boolean, default:false},
  points:{type:Number, default:0},
  posts:[mongoose.Schema.Types.ObjectId],
  // posts:{
    // QueistonID:]
  //   AnswerID:[]
  //   CommnetID:[]
  // }
  // postList:[mongoose.Schema.Types.ObjectId, refPath="postType"],
  // postType:{type:String, enum:[Question, Answer, Comment]}
}, {
  timestamps:true
})

// Create Model & Export
module.exports = mongoose.model('User', userSchema);