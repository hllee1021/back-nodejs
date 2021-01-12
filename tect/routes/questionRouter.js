var express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');

const Question = require('../models/question');
const Answer = require('../models/answer');
const Comment = require('../models/comment');
const { json } = require('body-parser');

//전체 읽어오기..성공
router.get('/', async (req, res) => {

  var questions = await Question.aggregate([
    { $match: { _id: { $exists: true } } },
    {
      $lookup: {
        from: 'answers',
        localField: '_id',
        foreignField: 'answerBody.postID',
        as: 'answerList'
      }
    }
  ])
    .exec()
  
  res.json(questions)
})

//questionID 이용해서 읽어오기
router.get('/:postID', (req, res) => {
    Promise.all([
      Question.findOne({_id:req.params.postID}),
      Answer.find({"answerBody.postID": req.params.postID}),
      Comment.find({"commentBody.postID":req.params.postID})
    ]).
    then((post)=>{
      var question, answers, comments ={}
      question =post[0]
      answers = post[1]
      comments = post[2]
      
      console.log(answers)
      res.json({question, answers, comments})
    }).
    catch((err)=>{
      console.log(err)
    })
  })
  

//Question 작성
router.post('/', (req, res) => {
  const post = new Question();
  const QUESTION_ID = req.body.postID
  

  post.questionBody.postID = QUESTION_ID;           //front에서 사용하게 될 ID (String)
  post._id = mongoose.Types.ObjectId(QUESTION_ID);  //back에서 사용하게 될 ID (mongoose ObjectID)
  post.questionBody.title = req.body.title;
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
