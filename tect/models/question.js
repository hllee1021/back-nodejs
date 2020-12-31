const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
const questionSchema = new Schema({
    questionID: {type:String},
    questionBody: {
        title : String,
        content: String,
        createdAt: String,
        lastUpdate: String,
        authorNickname: String,
        authorUID: String,
        answers:[String],
        comments:[String],
        hashtags:[String],
    }
});


// Create Model & Export
module.exports = mongoose.model('Question', questionSchema);