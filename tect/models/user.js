const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define Schemes

const userSchema = new Schema({
  firebaseUid:{type:String, required:true, unique:true},
  email:{type:String, required:true, unique:true, lowercase:true},
  displayName:{type:String, required:true, unique:true},
  deleted:{type:Boolean, default:false},
  points:{type:Number, default:0},
  introduce:{type:String, default:"Hello World"},
  // posts:[{type:mongoose.Schema.Types.ObjectId}],
  treeData:[{type:mongoose.Schema.Types.ObjectId, ref:"TechTree"}],
  //2021 01 27 
  posts:{
    question:[{type:mongoose.Schema.Types.ObjectId, ref:'Question'}],
    answer:[{type:mongoose.Schema.Types.ObjectId, ref:'Answer'}],
    questionComment:[{type:mongoose.Schema.Types.ObjectId, ref:'QuestionComment'}],
    answerComment:[{type:mongoose.Schema.Types.ObjectId, ref:'AnswerComment'}]
  }



  // postList:[mongoose.Schema.Types.ObjectId, refPath="postType"],
  // postType:{type:String, enum:[Question, Answer, Comment]}
}, {
  timestamps:true
})

// Create Model & Export
module.exports = mongoose.model('User', userSchema);