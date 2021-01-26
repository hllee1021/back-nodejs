var express = require('express');
const router = require('express').Router();
const Answer = require('../models/answer');
const mongoose = require('mongoose');

const User = require('../models/user')
const {CHECK_SESSION, CHECK_USER, VERIFY_SESSION,MAKE_SESSION} =require('../firebase/sessionAuth');
//ANSWER 불러오기 이것도 필요없고
router.get('/', (req, res)=>{
  Answer.find((err, lists)=>{
    if (err) {
      return res.status(500).send('Cannot Get Answer')
    } else {
      res.json(lists);
    }
  })
})


//answertID 이용해서 읽어오기 이거 필요 없는 것 같으넫
router.get('/:answerID', (req, res) => {
  Answer.findOne({ _id: req.params.answerID }).populate('postID').exec((err, lists)=>{
    if (err) return res.status(500).send("Cannot Get Answer by ID")
    res.json(lists);
  })
})



//ANSWER 작성
router.post('/', async (req, res)=> {

  const answer= new Answer();
  const POST_ID =req.body.postID
  const ANSWER_ID = req.body.answerID
         
  answer._id=mongoose.Types.ObjectId(ANSWER_ID);   
  answer.postID = mongoose.Types.ObjectId(POST_ID);
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

  try {
    const user = await CHECK_USER(req, res)
    db_user = await User.findOne({email:user.email}).exec()
    console.log(db_user)
    db_user.posts.answer.push(ANSWER_ID)
    db_user.save((err, result)=>{
      if(err) {
        console.log(err)
      } else {
        console.log(result)
      }
    })
  } catch (err) {
    console.log(err)
    // var USER_ID = mongoose.Types.ObjectId();

  }

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
