const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
const answerSchema = new Schema({
  authorNickname: { type: String},
  authorUID: { type: String},
  content: { type: String},
  createdAt: { type: String},
  lastUpdate:{type:String}
});


// Create Model & Export
module.exports = mongoose.model('Answer', answerSchema);