const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes

const answerSchema = new Schema({
  type:{type:String, default:"answer"},
  postID:{type:mongoose.Schema.Types.ObjectId, ref:'question'},
  content:{type:String, required:true},
  like:{type:Number, default:0},
  unlike:{type:Number, default:0},
  selected:{type:Boolean, default:false},
}, {
  timestamps:true
})



// Create Model & Export
module.exports = mongoose.model('Answer', answerSchema);