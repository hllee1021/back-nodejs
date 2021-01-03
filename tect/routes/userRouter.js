var express = require('express');
const router = require('express').Router();
const User = require('../models/user');
const mongoose = require('mongoose');

//전체 유저 읽어오기
router.get('/', (req, res)=>{
  Userr.find((err, lists)=>{
    if (err) {
      return res.status(500).send('Cannot Get Answer')
    } else {
      res.json(lists);
    }
  })
})

//userID 이용해서 읽어오기
router.get('/:userID', (req, res) => {
  User.findOne({ _id: req.params.userID }, (err, user) => {
    if (err) return res.status(500).send("Cannot Get USER by ID")
    res.json(user);
  })
})

router.post('/', (req, res)=> {
  const post= new User();
  const USER_ID = req.body.userID

  post._id = mongoose.Types.ObjectId(USER_ID);
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


router.put('/:userID', (req, res) => {
  User.updateOne(
    { _id: req.params.userID },
    {
      $set: {
        'userBody.nickname': req.body.nickname,
        'userBody.point': req.body.point,
        'userBody.point': req.body.point,
      }
    },
    (err, result) => {
      if (err) return res.json({ ERROR: "UPDATE FAILURE", err })
      res.json({ RESULT: "UPDATE SUCCEDD : ", result })
    })
})

router.delete('/:userID', (req, res) => {
  Question.findOne({ _id: req.params.userID }, (err, user) => {
    if (err) return res.json({ ERROR: "DELETE FAILURE" })
    user.isDelted = true;
    user.save((err=>{
      if(err) return res.json({ERROR:"USER DELETE FAILURE"})
      res.json({RESULT:"USER DELETED"})
    }))
  })
})

module.exports = router;
