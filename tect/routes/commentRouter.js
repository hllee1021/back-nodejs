var express = require('express');
const router = require('express').Router();
const Comment = require('../models/comment');
const mongoose = require('mongoose');

//COMMENT 불러오기
router.get('/', (req, res) => {
  Comment.find().populate('postId').exec((err, lists) => {
    if (err) {
      return res.status(500).send("cannot get author")
    } else {
      res.json(lists);
    }
  })
})

//commentID 이용해서 읽어오기
router.get('/:commentID', (req, res) => {
  Comment.findOne({ _id: req.params.commentID }).populate('postID').populate('parentID').exec((err, lists)=>{
    if (err) return res.status(500).send("Cannot Get Comment by ID")
    res.json(lists);
  });
})
//COMMENT 작성
router.post('/', (req, res) => {
  const comment = new Comment();
  const POST_ID = req.body.postID
  const PARENT_ID = req.body.parentID
  const COMMENT_ID = req.body.commentID

  comment._id = mongoose.Types.ObjectId(COMMENT_ID)
  comment.postID = mongoose.Types.ObjectId(POST_ID);
  comment.parentID = mongoose.Types.ObjectId(PARENT_ID);
  comment.commentBody.authorNickname = req.body.authorNickname;
  comment.commentBody.authorID = req.body.authorID;
  comment.commentBody.content = req.body.content;

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
router.put('/:commentID', (req, res) => {
  Comment.updateOne(
    { _id: req.params.commentID },
    {
      $set: {
        'commentBody.content': req.body.content,
        'commentBody.lastUpdate': Date.now()
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
    comment.isDeleted = true
    comment.save((err) => {
      if (err) return res.json({ ERROR: "COMMENT DELTED FAILURE" })
      res.json({ RESULT: "COMMENT DELETED" });
    })
  })
})

module.exports = router;
