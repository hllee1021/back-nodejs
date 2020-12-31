const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
const answerSchema = new Schema({
  answerID: {type:String},
  answerBody: {
    authorNickname: String,
    authorUID: String,
    content: String,
    createdAt: String,
    lastUpdate: String
  }
});


// Create Model & Export
module.exports = mongoose.model('Answer', answerSchema);