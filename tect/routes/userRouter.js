const express = require('express');
const app = express();
const router = require('express').Router();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Admin = require('../firebase/index');
app.use(cookieParser())
const User = require('../models/user')

const {CHECK_SESSION, CHECK_USER, VERIFY_SESSION,MAKE_SESSION} =require('../firebase/auth')

//전체 유저 읽어오기
router.get('/', (req, res)=>{
  User.find((err, lists)=>{
    if (err) {
      return res.status(500).send('Cannot Get Answer')
    } else {
      res.json(lists);
    }
  })
})

//userID 이용해서 읽어오기
router.get('/:userID', async (req, res) => {
  try{
    user = await User.findOne({ _id: req.params.userID })
    .populate('posts.question')
    .populate('posts.answer')
    .populate('posts.comment').exec()
    res.json(user)
  } catch(err) {
    res.json(err)
  }
})

router.put('/:userID', (req, res) => {
  User.updateOne(
    { _id: req.params.userID },
    {
      $set: {
        'nickname': req.body.nickname,
        'point': req.body.point
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
