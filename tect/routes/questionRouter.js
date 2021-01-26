var express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const async = require( "async" );

const Question = require('../models/question');
const Answer = require('../models/answer');
const Comment = require('../models/comment');
const { json } = require('body-parser');

const User = require('../models/user')
const {CHECK_SESSION, CHECK_USER, VERIFY_SESSION,MAKE_SESSION} =require('../firebase/sessionAuth');
const { populate } = require('../models/question');


//전체 읽어오기..성공
router.get('/', async (req, res) => {
  var questions = await Question.aggregate([
    { $match: { _id: { $exists: true } } },
    {
      $lookup: {
        from: 'answers',
        localField: '_id',
        foreignField: 'postID',
        as: 'answerList'
      }
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postID',
        as: 'commentList'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'posts',
        as : 'questionAuthor'
      }
    },
    {
      $project:{
        questionAuthor:1,
        type:1,
        hashtags:1,
        like:1,
        unlike:1,
        title:1,
        contentSubstring:{$substrCP:["$content", 0, 100]},
        createdAt:1,
        updatedAt:1,
        commentSum:{$size:"$commentList"},
        answerSum:{$size:"$answerList"}
      }
    }
  ])
    .sort({createdAt : -1})
    .limit(10)
    .exec()
  
  res.json(questions)
})

//questionID 이용해서 읽어오기
// router.get('/:postID', (req, res) => {
//     Promise.all([
//       Question.findOne({_id:req.params.postID}),
//       Answer.find({"postID": req.params.postID}),
//       Comment.find({"postID":req.params.postID})
//     ]).
//     then((post)=>{
//       var question, answers, comments ={}
//       question =post[0]
//       answers = post[1]
//       comments = post[2]
      
//       console.log(answers)
//       res.json({question, answers, comments})
//     }).
//     catch((err)=>{
//       console.log(err)
//     })
//   })

//populate 안되면 그냥 json 반환하도록 만들기 (현재는 populate 오류 시 빈 객체 반환)
router.get('/:postID', async (req, res) => {

  // question = await Question.findOne({ _id: req.params.postID }).populate('author').exec();
  // question_comments = await Comment.find({ postID: req.params.postID, postType: "Question" }).exec() 
  // questionList={question, question_comments}

  questions = await Question.aggregate([
    {$match:{_id:mongoose.Types.ObjectId(req.params.postID)}}
  ])
  .exec()

  questionList = await Question.aggregate([
    { $match: {_id:mongoose.Types.ObjectId(req.params.postID)} },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'posts.question',
        as: 'questionAuthor'
      }
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postID',
        as: 'questionComment'
      }
    },
    {
      $unwind: {
        path: "$questionComment",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "questionComment._id",
        foreignField: 'posts.comment',
        as: 'questionCommentAuthor'
      }
    }
  ])
  .exec()

  answerList = await Answer.aggregate([
    { $match: { postID:mongoose.Types.ObjectId(req.params.postID) } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'posts.answer',
        as: 'answerAuthor'
      }
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postID',
        as: 'answerComment'
      }
    },
    {
      $unwind: {
        path:"$answerComment",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "answerComment._id",
        foreignField: 'posts.comment',
        as: 'answerCommentAuthor'
      }
    }
  ])
    .exec()

  // answerList = await Answer.find({ postID: req.params.postID }).populate('comments').exec();
  // answer_comments = await Comment.find({ postID: req.params.postID, postType: "Answer" }).exec();

  res.json({ questionList, answerList })


})




//Question 작성
router.post('/', async (req, res) => {
  const post = new Question();
  const QUESTION_ID = req.body.postID
  post._id = mongoose.Types.ObjectId(QUESTION_ID); 
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
  //User DB에 저장
  try {
    const user = await CHECK_USER(req, res)
    db_user = await User.findOne({email:user.email}).exec()
    console.log(db_user)
    db_user.posts.question.push(QUESTION_ID)
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

})

//좋아요 싫어요

//Question 수정               
router.put('/:postID', (req, res) => {
  Question.updateOne(
    { _id: req.params.postID },
    {
      $set: {
        'title': req.body.title,
        'content': req.body.content,
        'hashtags': req.body.hashtags,
        'lastUpdate': Date.now(),
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
