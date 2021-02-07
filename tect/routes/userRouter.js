const express = require('express');
const app = express();
const router = require('express').Router();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

app.use(cookieParser())
const User = require('../models/user')

const {VERIFY_USER, FIND_MONGO_USER_BY_UID} =require('../firebase/tokenAuth')

//userID 이용해서 읽어오기
router.get('/:firebaseUid', async (req, res) => {
  try{
    user = await User.findOne({ firebaseUid: req.params.firebaseUid })
    .populate('treeData')
    .populate('posts.question')
    .populate('posts.answer')
    .populate('posts.questionComment')
    .populate('posts.answerComment')
    .exec()
    res.json(user)
  } catch(err) {
    res.json(err)
  }
})


router.put('/update', async (req, res) => {
  FIREBASE_USER= await VERIFY_USER(req,res)
  MONGO_USER = await FIND_MONGO_USER_BY_UID(FIREBASE_USER.uid)
  MONGO_UID = MONGO_USER[0]._id

  User.updateOne(
    { _id: MONGO_UID },
    {
      $set: {
        'displayName': req.body.displayname,
        'point': req.body.point
      }
    },
    (err, result) => {
      if (err) return res.json({ ERROR: "UPDATE FAILURE", err })
      res.json({ RESULT: "UPDATE SUCCEDD : ", result })
    })
})

// router.delete('/:userID', async (req, res) => {
// })

module.exports = router;
