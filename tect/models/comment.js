const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
const commentSchema = new Schema({
    commentID: {type:String},
    commentBody: {
        content: String,
        createdAt: String,
        lastUpdate: String,
        authorNickname: String,
        authorUID: String,
        comments:[String]
    }
});


// Create Model & Export
module.exports = mongoose.model('Comment', commentSchema);