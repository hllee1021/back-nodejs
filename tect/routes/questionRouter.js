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
    .sort({createdAt : -1})
    // .limit(10)
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



//검색
router.post('/search', function(req, res){
  const target=req.body.target;
  const query=new RegExp(req.body.target);
  var a;
  var uniquearr;
  Question.find({$or:[{'questionBody.title':query},{'questionBody.content':query}]},'_id',(err,lists)=>{
    if (err) {
      return res.status(500).send('Error occurs during serach question')
    } else {
      a=lists;
    }
  }).exec()
  .then((Qresult)=>{
    Answer.find({'answerBody.content':query},'answerBody.postID',(err,lists)=>{
      if (err) {
        return res.status(500).send('Error occurs during serach question')
      } else {
        a=a.concat(lists);
      }
      }).exec();
  })
  .then((QAresult)=>{
    const set=new Set(a);
    uniquearr=[...set];
  })
  .then((result)=>{
    if(uniquearr.length==0){
      return res.json([]);
    }
    Question.find({$or:uniquearr},(err,lists)=>{
      if (err) {
        return res.status(500).send('Error occurs during serach question')
      } else {
        res.json(lists);
      }
    }).exec()
  })
})
module.exports = router;
