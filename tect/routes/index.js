var express = require('express');
const router = require('express').Router();
const Subject = require('../models/subject');

router.get('/', (req, res)=>{
  Subject.find((err, posts)=>{
    if (err) {
      return res.status(500).send('Cannot Get Subjects')
    } else {
      res.json(posts);
    }
  })
})

router.post('/', (req, res)=> {
  const post= new Subject();
  post.authorNickname=req.body.authorNickname;
  post.authorUID=req.body.authorUID;
  post.content=req.body.content;
  post.createdAt=req.body.createdAt;
  
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
