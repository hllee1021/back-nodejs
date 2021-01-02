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
  const answer= new Answer();
  const POST_ID =req.body.postID
  const ANSWER_ID = req.body.answerID
  answer._id=mongoose.Types.ObjectId(ANSWER_ID);
  answer.answerBody.authorNickname=req.body.authorNickname;
  answer.answerBody.authorID=req.body.authorID;
  answer.answerBody.content=req.body.content;
  //answer에 저장
  answer.save((err)=>{
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
