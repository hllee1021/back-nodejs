var express = require('express');
const router = require('express').Router();
const Comment = require('../models/comment');
const mongoose = require('mongoose');

router.get('/', (req, res)=>{
  Comment.find().populate('postId').exec((err, lists) => {
    if (err) {
      return res.status(500).send("cannot get author")
    } else {
      res.json(lists);
    }
  })
})

router.post('/', (req, res)=> {
  const comment= new Comment();
  const POST_ID =req.body.postID
  const PARENT_ID = req.body.parentID
  const COMMENT_ID = req.body.commentID

  comment._id = mongoose.Types.ObjectId(COMMENT_ID)   //commentUID
  comment.postUID= mongoose.Types.ObjectId(POST_ID);
  comment.parentComment = mongoose.Types.ObjectId(PARENT_ID);
  comment.commentBody.authorNickname=req.body.authorNickname;
  comment.commentBody.authorID=req.body.authorID;
  comment.commentBody.content=req.body.content;

  //DB에 저장
  comment.save((err)=>{
    if (err) {
      console.log(err, "data save error");
      res.json({result: 0});
      return
    } else {
      res.json({result:1});
    }
  })
})


module.exports = router;

//checkId ()=>{}