var express = require('express');
const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res)=>{
  Userr.find((err, lists)=>{
    if (err) {
      return res.status(500).send('Cannot Get Answer')
    } else {
      res.json(lists);
    }
  })
})

router.post('/', (req, res)=> {
  const post= new User();
  post.userID=req.body.userID

  post.userBody.createdAt=req.body.createdAt;
  post.userBody.email=req.body.email;
  post.userBody.nickname=req.body.nickname;
  post.userBody.point=req.body.point;
  post.userBody.posts=req.body.posts
  
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
