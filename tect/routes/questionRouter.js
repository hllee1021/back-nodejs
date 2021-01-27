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
const {VERIFY_USER} =require('../firebase/tokenAuth');


//Question 작성
router.post('/', async (req, res) => {

  UID= await VERIFY_USER(req,res)


  const post = new Question();
  const QUESTION_ID = req.body.questionID
  const AUTHOR_ID = req.body.authorID || UID  //VERIFY_USER 하고 찾아서 넣어줘야한다

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

 
  const user = User.findeOne({firebaseUid:UID}).exec()
  user.post.push(QUESTION_ID)
  user.save((err, result)=>{
    if (err) { console.log(err)}
  })
})


//전체 읽어오기
router.get('/', async (req, res) => {
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
        answerSum:{$size:"$answerList"}
      }
    }
  ])
    .sort({createdAt : -1})
    .limit(10)
    .exec()

  res.json(questions)
})


// questionID 이용해서 읽어오기
router.get('/:questionID', async (req, res) => {
  var question, questionComments={}
  var answerList, answerComments ={}
  await Promise.all([
      Question.findOne({_id:req.params.questionID}).populate('author'),
      QuestionComment.find({"questionID":req.params.questionID}).populate('author'),
    ]).
    then((post)=>{
      
      question =post[0]
      questionComments = post[1]
      
    }).
    catch((err)=>{
      console.log(err)
    })

    answers = await Answer.find({"questionID": req.params.questionID})
    .populate('author')
    .exec()
    
    // answerList = post
    await answers.forEach(async (item)=>{
      comments = await AnswerComment.find({"answerID":item._id}).populate('author').exec()
      // console.log(item)
      // console.log(comments)
      answerList=item
      answerComments=comments
      console.log(answerList)
      console.log(answerComments)
    })
  
    
    // for (i in answerList) {
    //   AnswerComment.find({"answerID":answerList[i]._id})
    //   .exec()
    //   .then((post)=>{
    //     answerComments =post
    //   })
      
    // }
  
    res.json({question, questionComments})
  })

//populate 안되면 그냥 json 반환하도록 만들기 (현재는 populate 오류 시 빈 객체 반환)
// router.get('/:postID', async (req, res) => {

//   // question = await Question.findOne({ _id: req.params.postID }).populate('author').exec();
//   // question_comments = await Comment.find({ postID: req.params.postID, postType: "Question" }).exec() 
//   // questionList={question, question_comments}

//   questions = await Question.aggregate([
//     {$match:{_id:mongoose.Types.ObjectId(req.params.postID)}}
//   ])
//   .exec()

//   questionList = await Question.aggregate([
//     { $match: {_id:mongoose.Types.ObjectId(req.params.postID)} },
//     {
//       $lookup: {
//         from: 'users',
//         localField: '_id',
//         foreignField: 'posts.question',
//         as: 'questionAuthor'
//       }
//     },
//     {
//       $lookup: {
//         from: 'comments',
//         localField: '_id',
//         foreignField: 'postID',
//         as: 'questionComment'
//       }
//     },
//     {
//       $unwind: {
//         path: "$questionComment",
//         preserveNullAndEmptyArrays: true
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "questionComment._id",
//         foreignField: 'posts.comment',
//         as: 'questionCommentAuthor'
//       }
//     }
//   ])
//   .exec()

//   answerList = await Answer.aggregate([
//     { $match: { postID:mongoose.Types.ObjectId(req.params.postID) } },
//     {
//       $lookup: {
//         from: 'users',
//         localField: '_id',
//         foreignField: 'posts.answer',
//         as: 'answerAuthor'
//       }
//     },
//     {
//       $lookup: {
//         from: 'comments',
//         localField: '_id',
//         foreignField: 'postID',
//         as: 'answerComment'
//       }
//     },
//     {
//       $unwind: {
//         path:"$answerComment",
//         preserveNullAndEmptyArrays: true
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "answerComment._id",
//         foreignField: 'posts.comment',
//         as: 'answerCommentAuthor'
//       }
//     }
//   ])
//     .exec()

//   // answerList = await Answer.find({ postID: req.params.postID }).populate('comments').exec();
//   // answer_comments = await Comment.find({ postID: req.params.postID, postType: "Answer" }).exec();

//   res.json({ questionList, answerList })


// })


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
