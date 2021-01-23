const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define Schemes

const questionSchema = new Schema({
    //_id:objectID
    type:{type:String, default:"question"},
    title:{type:String, required:true},
    content:{type:String,required:true},
    hashtags:[String],
    like:{type:Number, default:0},
    unlike:{type:Number, default:0},
    // author:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    // authorName:{type:String, required:true},
    // comments:[mongoose.Schema.Types.ObjectId, ref='comment']
    //createdAt, lastUpdate


}, {
    timestamps:true
});


// Create Model & Export
module.exports = mongoose.model('Question', questionSchema);