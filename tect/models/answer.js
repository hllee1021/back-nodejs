  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes

const answerSchema = new Schema({
  type:{type:String, default:"answer"},
  questionID:{type:mongoose.Schema.Types.ObjectId, ref:'Question'},
  content:{type:String, required:true},
  like:{type:Number, default:0},
  dislike:{type:Number, default:0},
  selected:{type:Boolean, default:false},
  like_user:[{type:mongoose.Schema.Types.ObjectId}],
   //V.2021 01 27
   author:{type:mongoose.Schema.Types.ObjectId, ref:'User'},

}, {
  timestamps:true
})



// Create Model & Export
module.exports = mongoose.model('Answer', answerSchema);