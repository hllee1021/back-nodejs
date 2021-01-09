var express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');

const Question = require('../models/question');
const Answer = require('../models/answer');
const Comment = require('../models/comment');
const { json } = require('body-parser');

answerFind= async (questionID)=>{
  await Answer.find({ "answerBody.postID": questionID })
  .then(answerLists => {
    const answerNum = answerLists.length;
    console.log("find 중", i)
  })
  .then(()=>{
    return answerNum
  })

}

//전체 읽어오기
// router.get('/', (req, res) => {
//   Question.find()
//     .lean() //mogoose object > plain object로 가져오기
//     .exec()
//     .then((questionList) => {
//       //questionList 볼 때 answer 개수도 볼 수 있도록 loop이용해서 answerNum 추가.

//       for (i in questionList) {
//         questionID = questionList[i]._id;
//         console.log("find 전",i)

//         answerNum = answerFind(questionID)
//         console.log(answerNum)
//         questionList[i].questionBody.answerNum = answerNum;
        
//       }
//       res.json(questionList)
// })
//   .catch(e => { return res.status(500).send("Can't Get Question Lists") })
// })

router.get('/', (req, res) => {
  Question.aggregate([
    { $match: { _id : {$exists: true} } },
    { $lookup:{
      from: 'answers',
      localField:'_id',
      foreignField:'answerBody.postID',
      as:'answerList'
    }}
  ])
  .exec()
  .then((questions=>{res.json(questions)}))
})






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

module.exports = router;
