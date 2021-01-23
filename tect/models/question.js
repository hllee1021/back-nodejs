const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define Schemes
// const questionSchema = new Schema({
//     questionBody: {
//         postID: {type:String}, //required:true
//         title : {type: String, required:true},
//         content: {type: String, required:true},
//         // createdAt: {type : Date, default:Date.now},
//         // lastUpdate: {type: Date, default:Date.now},
//         authorNickname: {type: String, required:true},
//         authorID: {type: String, required:true},
//         hashtags:[String],
//     }
// }, {
//     timestamps:true
// });
const questionSchema = new Schema({
    //_id:objectID
    type:{type:String, default:"question"},
    title:{type:String, required:true},
    content:{type:String,required:true},
    hashtags:[String],
    like:{type:Number, default:0},
    unlike:{type:Number, default:0},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    authorName:{type:String, required:true},
    comments:[mongoose.Schema.Types.ObjectId, ref='comment']
    //createdAt, lastUpdate


}, {
    timestamps:true
});


// Create Model & Export
module.exports = mongoose.model('Question', questionSchema);