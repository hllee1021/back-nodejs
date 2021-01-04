const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Schemes
const commentSchema = new Schema({
    commentBody: {
        postID: {type:mongoose.SchemaTypes.ObjectId, ref:'Question' ,required:true},
        commentID: {type:String},
        parentID:{type:mongoose.Schema.Types.ObjectId, ref:'Comment'},
        content: {type:String},
        createdAt: {type:Date, default:Date.now},
        lastUpdate: {type:Date, default:Date.now},
        authorNickname: {type:String},
        authorID: {type:String},
        //authorID: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
        isDeleted:{type:Boolean , default:false}
    }
});


// Create Model & Export
module.exports = mongoose.model('Comment', commentSchema);










// var mongoose = require('mongoose');

// // schema
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

// // model & export
// var Comment = mongoose.model('comment',commentSchema);
// module.exports = Comment;