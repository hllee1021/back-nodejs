var express = require('express');
const router = require('express').Router();
const Comment = require('../models/comment');

router.get('/', (req, res)=>{
  Comment.find((err, lists)=>{
    if (err) {
      return res.status(500).send('Cannot Get Comment')
    } else {
      res.json(lists);
    }
  })
})

router.post('/', (req, res)=> {
  const post= new Comment();
  post.commentID=req.body.commentID
  post.commentBody.authorNickname=req.body.authorNickname;
  post.commentBody.authorUID=req.body.authorUID;
  post.commentBody.content=req.body.content;
  post.commentBody.createdAt=req.body.createdAt;
  post.commentBody.lastUpdate=req.body.lastUpdate;
  post.commentBody.comments=req.body.comments
  
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
