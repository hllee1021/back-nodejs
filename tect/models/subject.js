const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
//Shema 내부에 과목명을 적는 방식을 이용해야되나?
const subjectSchema = new Schema({
  subjectName: {type: String},
  authorNickname: { type: String},
  authorUID: { type: String},
  content: { type: String},
  createdAt: { type: String}
});


// Create Model & Export
module.exports = mongoose.model('Subject', subjectSchema);