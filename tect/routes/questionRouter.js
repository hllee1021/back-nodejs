var express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const async = require( "async" );

const Question = require('../models/question');
const Answer = require('../models/answer');
const QuestionComment = require('../models/questionComment');
const AnswerComment = require('../models/answerComment')
const { json } = require('body-parser');

const User = require('../models/user')
const {VERIFY_USER, FIND_MONGO_USER_BY_UID} =require('../firebase/tokenAuth');


//Question 작성
router.post('/', async (req, res) => {
  FIREBASE_USER= await VERIFY_USER(req,res)
  MONGO_UID = await FIND_MONGO_USER_BY_UID(FIREBASE_USER.uid)[0]._id
  console.log(MONGO_UID)
  const post = new Question();
  const QUESTION_ID = req.body.questionID
  const AUTHOR_ID = MONGO_UID || null  //VERIFY_USER 하고 찾아서 넣어줘야한다

  post._id = mongoose.Types.ObjectId(QUESTION_ID); 
  post.author = mongoose.Types.ObjectId(AUTHOR_ID);
  post.title = req.body.title;
  post.content = req.body.content;
  post.hashtags = req.body.hashtags;
  
  //Question DB에 저장
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

  const user = await User.findOne({firebaseUid:FIREBASE_USER.uid}).exec()
  user.posts.push(QUESTION_ID)
  user.save((err, result)=>{
    if (err) { console.log(err)}
  })
})


//전체 읽어오기
router.get('/page/:page', async (req, res) => {
  var page = req.params.page
  var offset = (page-1)*10
  var questions = await Question.aggregate([
    { $match: { _id: { $exists: true } } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'posts',
        as: 'author'
      }
    },
    {
      $lookup: {
        from: 'answers',
        localField: '_id',
        foreignField: 'questionID',
        as: 'answerList'
      }
    },
    {
      $lookup: {
        from: 'questionComments',
        localField: '_id',
        foreignField: 'questionID',
        as: 'commentList'
      }
    },
    {
      $project:{
        "author.displayName":1,
        "author.points":1,
        type:1,
        hashtags:1,
        like:1,
        unlike:1,
        title:1,
        contentSubstring:{$substrCP:["$content", 0, 100]},
        createdAt:1,
        updatedAt:1,
        commentSum:{$size:"$commentList"},
        answerSum:{$size:"$answerList"},
        // questionSum:{$size:"$question"}
      }
    }
  ])
  .sort({createdAt : -1})
  .skip(offset)
  .limit(10)
  .exec()
  
  var questionSum = await Question.find().count()
  res.send({questionSum: questionSum, question : questions})
})


// questionID 이용해서 읽어오기
router.get('/:questionID', async (req, res) => {
  var question, questionComments = {}
  await Promise.all([
    Question.findOne({ _id: req.params.questionID }).populate('author'),
    QuestionComment.find({ "questionID": req.params.questionID }).populate('author'),
  ])
  .then((post) => {
    question = post[0]
    questionComments = post[1]
  })
  .catch((err) => {
    console.log(err)
  })
    
  
  answers = await Answer.find({"questionID": req.params.questionID })
  .populate('author')
  .exec()

  try{
    answerList = await Promise.all(
      answers.map(async (eachAnswer)=>{
        answerComments = await AnswerComment.find({ "answerID": eachAnswer._id }).populate('author').exec()
        answerObject = {eachAnswer,answerComments}
        // console.log(answerObject)
        return answerObject
      })
    )
  } catch(err) {
    console.log('errr:', err)
  }
  

  res.json({ question, questionComments, answerList })
})



//Question 수정               
router.put('/:questionID', (req, res) => {
  Question.updateOne(
    { _id: req.params.questionID },
    {
      $set: {
        'title': req.body.title,
        'content': req.body.content,
        'hashtags': req.body.hashtags,
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


//좋아요
//좋아요 누른 userId question 모델에 저장 || 좋아요 누른 postID user 모델에 저장
router.put('/:questionID/like', async (req, res)=>{
  
  if (user.posts.like == false) {
    
    await Question.updateOne({_id:req.params.questionID},{$set : {'like': like +1 }})
  }
  
})

module.exports = router;
