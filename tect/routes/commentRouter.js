var express = require('express');
const router = require('express').Router();

const QuestionComment = require('../models/questionComment');
const AnswerComment = require('../models/answerComment')
const User=require('../models/user')
const mongoose = require('mongoose');
const {VERIFY_USER, FIND_MONGO_USER_BY_UID} =require('../firebase/tokenAuth');

//COMMENT 작성
router.post('/questionComment', async (req, res) => {
  FIREBASE_USER= await VERIFY_USER(req,res)
  MONGO_USER = await FIND_MONGO_USER_BY_UID(FIREBASE_USER.uid)
  MONGO_UID = MONGO_USER[0]._id
  
  const comment = new QuestionComment();
  const POST_ID = req.body.questionID
  const PARENT_ID = req.body.parentID
  const COMMENT_ID = req.body.commentID
  const AUTHOR_ID = MONGO_UID || null

  comment._id = mongoose.Types.ObjectId(COMMENT_ID);
  comment.questionID = mongoose.Types.ObjectId(POST_ID); 
  // comment.parentID = mongoose.Types.ObjectId(PARENT_ID); //이거 어떻게 해결하지
  comment.parentID = PARENT_ID
  comment.content = req.body.content;
  comment.author = mongoose.Types.ObjectId(AUTHOR_ID);

  comment.save((err) => {
    if (err) {
      console.log(err, "data save error");
      res.json({ result: 0 });
      return
    } else {
      res.json({ result: 1 });
    }
  })

  const user = await User.findOne({firebaseUid:FIREBASE_USER.uid}).exec()
  user.posts.questionComment.push(COMMENT_ID)
  user.save((err, result)=>{
    if (err) { console.log(err)}
  })

})

//answerComment 작성 1
router.post('/answerComment', async (req, res)=>{
  FIREBASE_USER= await VERIFY_USER(req,res)
  MONGO_USER = await FIND_MONGO_USER_BY_UID(FIREBASE_USER.uid)
  MONGO_UID = MONGO_USER[0]._id

  const comment = new AnswerComment();
  const POST_ID = req.body.answerID
  const PARENT_ID = req.body.parentID
  const COMMENT_ID = req.body.commentID
  const AUTHOR_ID = MONGO_UID || null

  comment._id = mongoose.Types.ObjectId(COMMENT_ID);
  comment.answerID = mongoose.Types.ObjectId(POST_ID); 
  // comment.parentID = mongoose.Types.ObjectId(PARENT_ID); //이거 어떻게 해결하지
  comment.parentID = PARENT_ID
  comment.content = req.body.content;
  comment.author = mongoose.Types.ObjectId(AUTHOR_ID);

  comment.save((err) => {
    if (err) {
      console.log(err, "data save error");
      res.json({ result: 0 });
      return
    } else {
      res.json({ result: 1 });
    }
  })

  const user = await User.findOne({firebaseUid:FIREBASE_USER.uid}).exec()
  user.posts.answerComment.push(COMMENT_ID)
  user.save((err, result)=>{
    if (err) { console.log(err)}
  })

})




//COMMENT 수정
router.put('/questionComment/:commentID', (req, res) => {
  QuestionComment.updateOne(
    { _id: req.params.commentID },
    {
      $set: {
        'content': req.body.content,
        // 'lastUpdate': Date.now()
      }
    },
    (err, result) => {
      if (err) return res.json({ ERROR: "UPDATE FAILURE : ", err })
      res.json({ RESULT: "UPDATE SUCCEDDDD : ", result })
    })
})

router.put('/answerComment/:commentID', (req, res) => {
  AnswerComment.updateOne(
    { _id: req.params.commentID },
    {
      $set: {
        'content': req.body.content,
        // 'lastUpdate': Date.now()
      }
    },
    (err, result) => {
      if (err) return res.json({ ERROR: "UPDATE FAILURE : ", err })
      res.json({ RESULT: "UPDATE SUCCEDDDD : ", result })
    })
})


//COMMENT 삭제 - isDelted = true 이면 front에서 숨기도록 구현
router.delete('/questionComment/:commentID', (req, res) => {
  QuestionComment.findOne({ _id: req.params.commentID }, (err, comment) => {
    if (err) return res.json({ ERROR: "CANT FIND COMMENT" })
    comment.deleted = true
    comment.save((err, comment) => {
      if (err) return res.json({ ERROR: "COMMENT DELTED FAILURE" })
      res.json(comment);
    })
  })
})

router.delete('/answerComment/:commentID', (req, res) => {
  AnswerComment.findOne({ _id: req.params.commentID }, (err, comment) => {
    if (err) return res.json({ ERROR: "CANT FIND COMMENT" })
    comment.deleted = true
    comment.save((err, comment) => {
      if (err) return res.json({ ERROR: "COMMENT DELTED FAILURE" })
      res.json(comment);
    })
  })
})

module.exports = router;
