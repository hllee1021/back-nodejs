const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
const answerSchema = new Schema({
  postID: {type:mongoose.SchemaTypes.ObjectId, ref:'Question' ,required:true},
  answerBody: {
    authorNickname: {type:String, required:true},
    authorID: {type:String, required:true},
    content: {type:String, required:true},
    createdAt: {type:Date, default:Date.now},
    lastUpdate:  {type:Date, default:Date.now}
  }
});


// Create Model & Export
module.exports = mongoose.model('Answer', answerSchema);