var express = require('express');
const router = require('express').Router();
const Question = require('../models/question');
const Answer = require('../models/answer');
const Comment = require('../models/comment');
const mongoose = require('mongoose');
const { render } = require('pug');

//ANSWER 불러오기
router.get('/', (req, res)=>{
  Answer.find((err, lists)=>{
    if (err) {
      return res.status(500).send('Cannot Get Answer')
    } else {
      res.json(lists);
    }
  })
})


//answertID 이용해서 읽어오기
router.get('/:answerID', (req, res) => {
  Answer.findOne({ _id: req.params.answerID }).populate('postID').exec((err, lists)=>{
    if (err) return res.status(500).send("Cannot Get Answer by ID")
    res.json(lists);
  })
})



//ANSWER 작성
router.post('/', (req, res)=> {
  const answer= new Answer();
  const POST_ID =req.body.postID
  const ANSWER_ID = req.body.answerID


  pid= mongoose.Types.ObjectId(POST_ID);
  aid=mongoose.Types.ObjectId(ANSWER_ID);
  var doc;
  Question.findOne({_id:pid}, function(err, question){
    if(err) throw err;
    doc = question;
    console.log(doc);
    doc.questionBody.answerID.push(aid);
    console.log(doc.questionBody.answerID);
    doc.save();
  });


  answer.answerBody.answerID = ANSWER_ID              //front에서 사용하게 될 ID (String)
  answer._id=mongoose.Types.ObjectId(ANSWER_ID);      //back에서 사용하게 될 ID (mongoose ObjectID)
  // answer.answerBody.postID = mongoose.Types.ObjectId(POST_ID);
  answer.answerBody.authorNickname=req.body.authorNickname;
  answer.answerBody.authorID=req.body.authorID;
  answer.answerBody.content=req.body.content;
  answer.answerBody.commentId=[];
  //answer에 저장
  answer.save((err)=>{
    if (err) {
      console.log(err, "data save error");
      res.json({result: 0});
      return
    } else {
      res.json({result:1});
    }
  })
})


//Answer 수정
router.put('/:answerID', (req, res) => {
  Answer.updateOne(
    { _id: req.params.answerID },
    {
      $set: {
        'answerBody.content': req.body.content,
        'answerBody.lastUpdate': Date.now()
      }
    },
    (err, result) => {
      if (err) return res.json({ ERROR: "UPDATE FAILURE : ", err })
      res.json({ RESULT: "UPDATE SUCCEDDDD : ", result })
    })
})

//Answer 삭제
router.delete('/:answerID', (req, res)=>{
  Answer.deleteOne({_id:req.params.answerID}, (err, result)=>{
    if(err) return res.json({ERROR:"DELETE FAILURE"})
    res.json({RESULT:"DATA DELETED"})
    console.log(result)
  })
})

module.exports = router;
