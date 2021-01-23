var express = require('express');
const router = require('express').Router();
const Answer = require('../models/answer');
const mongoose = require('mongoose');

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
  try {
    const user = await CHECK_USER(req, res)
    db_user = await User.findOne({email:user.email}).exec()
    console.log(db_user)
    var USER_ID = db_user._id
    var USER_NICKNAME = db_user.nickname
  } catch {
    var USER_ID = mongoose.Types.ObjectId();
    var USER_NICKNAME = req.body.authorName
  }

  const answer= new Answer();
  const POST_ID =req.body.postID
  const ANSWER_ID = req.body.answerID
         
  answer._id=mongoose.Types.ObjectId(ANSWER_ID);   
  answer.postID = mongoose.Types.ObjectId(POST_ID);
  answer.content=req.body.content;
  answer.authorName=USER_NICKNAME
  answer.author=USER_ID
  
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
