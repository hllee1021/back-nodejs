const express = require('express');
const app = express();
const router = require('express').Router();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

app.use(cookieParser())
const User = require('../models/user')

const {MAKE_MONGO_USER, FIND_MONGO_USER_BY_UID} =require('../firebase/tokenAuth')

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
router.get('/:firebaseUid', async (req, res) => {
  mongoUser = await FIND_MONGO_USER_BY_UID(req.params.firebaseUid)
  try{
    user = await User.findOne({ _id: mongoUser[0]._id })
    .populate('treeData')
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
