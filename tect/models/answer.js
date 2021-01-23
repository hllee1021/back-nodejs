const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
// const answerSchema = new Schema({
//   answerBody: {
//     answerID: { type: String },
//     postID: { type: mongoose.SchemaTypes.ObjectId, ref: 'Question', required: true },
//     authorNickname: { type: String, required: true },
//     authorID: { type: String, required: true },
//     content: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//     lastUpdate: { type: Date, default: Date.now }
//   }
// });
const answerSchema = new Schema({
  type:{type:String, default:"answer"},
  postID:{type:mongoose.Schema.Types.ObjectId, ref:'question'},
  content:{type:String, required:true},
  like:{type:Number, default:0},
  unlike:{type:Number, default:0},
  selected:{type:Boolean, default:false},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
  authorName:{type:String},
  commnets:[mongoose.Schema.Types.ObjectId, ref="comment"]
}, {
  timestamps:true
})



// Create Model & Export
module.exports = mongoose.model('Answer', answerSchema);