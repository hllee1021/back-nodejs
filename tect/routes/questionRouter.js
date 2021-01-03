var express = require('express');
const router = require('express').Router();
const Question = require('../models/question');
const mongoose = require('mongoose');

//전체 읽어오기
router.get('/', (req, res) => {
  Question.find((err, lists) => {
    if (err) {
      return res.status(500).send('Cannot Get Question')
    } else {
      res.json(lists);
    }
  })
})

//postID 이용해서 읽어오기
router.get('/:postID', (req, res) => {
  Question.findOne({ _id: req.params.postID }, (err, post) => {
    if (err) return res.status(500).send("Cannot Get Question by ID")
    res.json(post);
  })
})

//Question 작성
router.post('/', (req, res) => {
  const post = new Question();
  const POST_ID = req.body.postID

  post._id = mongoose.Types.ObjectId(POST_ID)
  post.questionBody.title = req.body.title
  post.questionBody.content = req.body.content;
  post.questionBody.authorNickname = req.body.authorNickname;
  post.questionBody.authorID = req.body.authorID;
  post.questionBody.hashtags = req.body.hashtags;

  //DB에 저장
  post.save((err, result) => {
    if (err) {
      res.json({ ERROR: "DATA SAVE ERROR" });
      console.log(err)
      return
    } else {
      //user post 목록에 저장
      res.json({ RESULT: "DATA SAVED : ", result });
    }
  })
})


//Question 수정               
router.put('/:postID', (req, res) => {
  Question.updateOne(
    { _id: req.params.postID },
    {
      $set: {
        'questionBody.title': req.body.title,
        'questionBody.content': req.body.content,
        'questionBody.hashtags': req.body.hashtags,
        'questionBody.lastUpdate': Date.now(),
      }
    },
    (err, result) => {
      if (err) return res.json({ ERROR: "UPDATE FAILURE", err })
      res.json({ RESULT: "UPDATE SUCCEDD : ", result })
    })
})


//Question 삭제
router.delete('/:postID', (req, res) => {
  Question.deleteOne({ _id: req.params.postID }, (err, result) => {
    if (err) return res.json({ ERROR: "DELETE FAILURE" })
    res.json({ RESULT: "DATA DELETED : ", result })
  })
})

module.exports = router;