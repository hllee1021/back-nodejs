var express = require('express');
const router = require('express').Router();
const Answer = require('../models/answer');
const mongoose = require('mongoose');


const {VERIFY_USER, FIND_MONGO_USER_BY_UID} =require('../firebase/tokenAuth');

//ANSWER 작성
router.post('/', async (req, res)=> {
  FIREBASE_USER= await VERIFY_USER(req,res)
  MONGO_UID = await FIND_MONGO_USER_BY_UID(FIREBASE_USER.uid)[0]._id
  
  const answer= new Answer();
  const POST_ID =req.body.questionID
  const ANSWER_ID = req.body.answerID
  const AUTHOR_ID = MONGO_UID || null //VERIFY_USER 하고 찾아서 넣어줘야한다
  
  answer._id=mongoose.Types.ObjectId(ANSWER_ID);   
  answer.author = mongoose.Types.ObjectId(AUTHOR_ID);
  answer.questionID = mongoose.Types.ObjectId(POST_ID);
  answer.content=req.body.content;
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
        'content': req.body.content,
        'lastUpdate': Date.now()
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
