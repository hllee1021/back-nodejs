var express = require('express');
const router = require('express').Router();
const Answer = require('../models/answer');
const mongoose = require('mongoose');

router.get('/', (req, res)=>{
  Answer.find((err, lists)=>{
    if (err) {
      return res.status(500).send('Cannot Get Answer')
    } else {
      res.json(lists);
    }
  })
})

router.post('/', (req, res)=> {
  const post= new Answer();
  post._id = new mongoose.Types.ObjectId();
  post.answerID=req.body.answerID;
  post.answerBody.authorNickname=req.body.authorNickname;
  post.answerBody.authorUID=req.body.authorUID;
  post.answerBody.content=req.body.content;
  post.answerBody.createdAt=req.body.createdAt;
  post.answerBody.lastUpdate=req.body.lastUpdate;
  
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
