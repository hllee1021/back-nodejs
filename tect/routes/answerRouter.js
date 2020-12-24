var express = require('express');
const router = require('express').Router();
const Answer = require('../models/answer');

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
  post.authorNickname=req.body.authorNickname;
  post.authorUID=req.body.authorUID;
  post.content=req.body.content;
  post.createdAt=req.body.createdAt;
  post.lastUpdate=req.body.lastUpdate;
  
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
