var express = require('express');
const router = require('express').Router();
const Question = require('../models/question');

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
  post.questionID=req.body.questionID
  post.title = req.body.title
  post.questionBody.content=req.body.content;
  post.questionBody.createdAt=req.body.createdAt;
  post.questionBody.lastUpdate=req.body.lastUpdate;
  post.questionBody.authorNickname=req.body.authorNickname;
  post.questionBody.authorUID=req.body.authorUID;
  post.questionBody.answers=req.body.answers;
  post.questionBody.comments=req.body.comments;
  post.questionBody.hashtags=req.body.hashtags;
  
  //DB에 저장
  post.save((err)=>{
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
