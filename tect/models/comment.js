const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question= require('./question');
const Answer = require('./answer')
// Define Schemes

const commentSchema = new Schema({
    // postID:{type:mongoose.Schema.Types.ObjectId, required:true, refPath:"postType"},
    // postType:{type:String, required:true, enum:[Question, Answer]},
    // parentID:{type:mongoose.Schema.Types.ObjectId, required:true},

    postType:{type:String, required:true},
    postID:{type:mongoose.Schema.Types.ObjectId, required:true},
    parentID:{type:String, required:true},
    content:{type:String, required:true},
    like:{type:Number, default:0},
    unlike:{type:Number, default:0},
    selected:{type:Boolean, default:false},
    deleted:{type:Boolean, default:false},
}, {
    timestamps:true
})

// Create Model & Export
module.exports = mongoose.model('Comment', commentSchema);


// var commentSchema = mongoose.Schema({
//   post:{type:mongoose.Schema.Types.ObjectId, ref:'post', required:true},   // 1
//   author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true}, // 1
//   parentComment:{type:mongoose.Schema.Types.ObjectId, ref:'comment'}, // 2
//   text:{type:String, required:[true,'text is required!']},
//   isDeleted:{type:Boolean}, // 3
//   createdAt:{type:Date, default:Date.now},
//   updatedAt:{type:Date},
// },{
//   toObject:{virtuals:true}
// });

// commentSchema.virtual('childComments') //4
//   .get(function(){ return this._childComments; })
//   .set(function(value){ this._childComments=value; });
