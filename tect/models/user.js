const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question= require('./question');
const Answer = require('./answer');
const Comment = require('./comment')

// Define Schemes

const userSchema = new Schema({
  email:{type:String, required:true, unique:true, lowercase:true},
  nickname:{type:String, required:true, unique:true},
  deleted:{type:Boolean, default:false},
  points:{type:Number, default:0},
  posts:{
    question:[{type:mongoose.Schema.Types.ObjectId, ref:'Question'}],
    answer:[{type:mongoose.Schema.Types.ObjectId, ref:'Answer'}],
    comment:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}]
  }
  //아래 처럼 나누는게 좋을지도?
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