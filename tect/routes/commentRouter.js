var express = require('express');
const router = require('express').Router();

const Question = require('../models/question')
const Answer = require('../models/answer')
const Comment = require('../models/comment');
const mongoose = require('mongoose');

const User = require('../models/user')
const {CHECK_SESSION, CHECK_USER, VERIFY_SESSION,MAKE_SESSION} =require('../firebase/auth');
const question = require('../models/question');
const answer = require('../models/answer');

//COMMENT 불러오기 이것도 필요 없을듯
router.get('/', (req, res) => {
  Comment.find().populate('postID').exec((err, lists) => {
    if (err) {
      return res.status(500).send("cannot get author")
    } else {
      res.json(lists);
    }
  })
})

//commentID 이용해서 읽어오기 이것도 필요 없을 거고
router.get('/:commentID', (req, res) => {
  Comment.findOne({ _id: req.params.commentID }).populate('postID').populate('parentID').exec((err, lists)=>{
    if (err) return res.status(500).send("Cannot Get Comment by ID")
    res.json(lists);
  });
})

//COMMENT 작성
router.post('/', async (req, res) => {

  const comment = new Comment();
  const POST_ID = req.body.postID
  const POST_TYPE = req.body.postType
  const PARENT_ID = req.body.parentID
  const COMMENT_ID = req.body.commentID

  comment._id = mongoose.Types.ObjectId(COMMENT_ID);
  comment.postID = mongoose.Types.ObjectId(POST_ID); 
  // comment.parentID = mongoose.Types.ObjectId(PARENT_ID); //이거 어떻게 해결하지
  comment.parentID = PARENT_ID
  comment.content = req.body.content;
  comment.postType = POST_TYPE

  comment.save((err) => {
    if (err) {
      console.log(err, "data save error");
      res.json({ result: 0 });
      return
    } else {
      res.json({ result: 1 });
    }
  })


  try {
    const user = await CHECK_USER(req, res)
    db_user = await User.findOne({email:user.email}).exec()
    console.log(db_user)
    db_user.posts.push(COMMENT_ID)
    db_user.save((err, result)=>{
      if(err) {
        console.log(err)
      } else{
        console.log(result)
      }
    })
  } catch (err){
    console.log(err)
    // var USER_ID = mongoose.Types.ObjectId();
  }
  // if (POST_TYPE = "question") {
  //   question = await Question.findOne({_id:POST_ID}).exec()
  //   question.comments.push(comment._id)
  //   question.save((err)=>{
  //     if(err) {console.log(err)}
  //     else {console.log(question)}
  //   })
  // } else if (POST_TYPE='answer') {
  //   answer = await Answer.findOne({_id:POST_ID}).exec()
  //   answer.comments.push(comment._id)
  //   answer.save((err)=>{
  //     if(err) {console.log(err)}
  //     else {console.log(answer)}
  //   }) 
  //   }

})


//COMMENT 수정
router.put('/:commentID', (req, res) => {
  Comment.updateOne(
    { _id: req.params.commentID },
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


//COMMENT 삭제 - isDelted = true 이면 front에서 숨기도록 구현
router.delete('/:commentID', (req, res) => {
  Comment.findOne({ _id: req.params.commentID }, (err, comment) => {
    if (err) return res.json({ ERROR: "CANT FIND COMMENT" })
    comment.deleted = true
    comment.save((err, comment) => {
      if (err) return res.json({ ERROR: "COMMENT DELTED FAILURE" })
      res.json(comment);
    })
  })
})

module.exports = router;
