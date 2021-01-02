var express = require('express');
const router = require('express').Router();
const Question = require('../models/question');
const mongoose = require('mongoose');


router.get('/', (req, res)=>{
  Question.find((err, lists)=>{
    if (err) {
      return res.status(500).send('Cannot Get Question')
    } else {
      res.json(lists);
    }
  })
})

router.post('/', (req, res)=> {
  const post= new Question();
  const POST_ID = req.body.postID

  post._id = mongoose.Types.ObjectId(POST_ID)
  post.postID= mongoose.Types.ObjectId(POST_ID);
  post.questionBody.title = req.body.title
  post.questionBody.content=req.body.content;
  post.questionBody.authorNickname=req.body.authorNickname;
  post.questionBody.authorUID=req.body.authorUID;
  post.questionBody.hashtags=req.body.hashtags;
  
  //DB에 저장
  post.save((err)=>{
    if (err) {
      console.log(err, "data save error");
      res.json({result: 0});
      return
    } else {
      //user post 목록에 저장
      res.json({result:1});
    }
  })
})


module.exports = router;
