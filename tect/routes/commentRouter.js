var express = require('express');
const router = require('express').Router();

const QuestionComment = require('../models/questionComment');
const AnswerComment = require('../models/answerComment')
const mongoose = require('mongoose');


//COMMENT 작성
router.post('/questionComment', async (req, res) => {

  const comment = new QuestionComment();
  const POST_ID = req.body.questionID
  const PARENT_ID = req.body.parentID
  const COMMENT_ID = req.body.commentID
  const AUTHOR_ID = req.body.authorID

  comment._id = mongoose.Types.ObjectId(COMMENT_ID);
  comment.questionID = mongoose.Types.ObjectId(POST_ID); 
  // comment.parentID = mongoose.Types.ObjectId(PARENT_ID); //이거 어떻게 해결하지
  comment.parentID = PARENT_ID
  comment.content = req.body.content;
  comment.author = AUTHOR_ID

  comment.save((err) => {
    if (err) {
      console.log(err, "data save error");
      res.json({ result: 0 });
      return
    } else {
      res.json({ result: 1 });
    }
  })
})

//answerComment 작성
router.post('/answerComment', async(req, res)=>{
  const comment = new AnswerComment();
  const POST_ID = req.body.answerID
  const PARENT_ID = req.body.parentID
  const COMMENT_ID = req.body.commentID
  const AUTHOR_ID = req.body.authorID

  comment._id = mongoose.Types.ObjectId(COMMENT_ID);
  comment.answerID = mongoose.Types.ObjectId(POST_ID); 
  // comment.parentID = mongoose.Types.ObjectId(PARENT_ID); //이거 어떻게 해결하지
  comment.parentID = PARENT_ID
  comment.content = req.body.content;
  comment.author = AUTHOR_ID

  comment.save((err) => {
    if (err) {
      console.log(err, "data save error");
      res.json({ result: 0 });
      return
    } else {
      res.json({ result: 1 });
    }
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
