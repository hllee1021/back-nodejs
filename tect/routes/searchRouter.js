var express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const async = require( "async" );

const Question = require('../models/question');
const Answer = require('../models/answer');
// const Comment = require('../models/comment');
const { json } = require('body-parser');

//검색
router.get('/', async function(req, res){
    const {target,page}=req.query;
    const query=new RegExp(target,'i');
    var offset = (page-1)*10
    var a;
    var uniquearr;
    async.waterfall([
    function(callback){
        Question.find({$or:[{'title':query},{'content':query}]},'_id',(err,lists)=>{
          if (err) {
            return res.status(500).send('Error occurs during serach question')
          } else {
            a=lists;
            // console.log(a);
            callback(null);
          }
        });
      },
      function(callback){
        Answer.find({'content':query},{_id:0,'questionID':1},(err,lists)=>{
          if (err) {
            return res.status(500).send('Error occurs during serach question')
          } else {
            var result=[];
            for(var i=0;i<lists.length;i++){
              var cur={};
              cur['_id']=lists[i]['questionID'];
              result.push(cur);
            }
            a=a.concat(result);
            // console.log(result);
            callback(null);
          }
        });
      },
      function(callback){
        const set=new Set(a);
        uniquearr=[...set];
        callback(null);
      }],
      async function(){
        var questions = await Question.aggregate([
          { $match: { $or:uniquearr} },
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
              answerSum:{$size:"$answerList"},
              // questionSum:{$size:"$question"}
            }
          }
        ])
        .sort({createdAt : -1})
        .skip(offset)
        .limit(10)
        .exec()
        var questionSum = questions.length;
        res.send({questionSum: questionSum, question : questions})
      }
    )
  })




router.get('/hash', async (req, res) => {
  var {target,page}=req.query;
  var offset = (page-1)*10
  var questions = await Question.aggregate([
    { $match: { hashtags:{$in:[target]} } },
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
        answerSum:{$size:"$answerList"},
        // questionSum:{$size:"$question"}
      }
    }
  ])
  .sort({createdAt : -1})
  .skip(offset)
  .limit(10)
  .exec()
  var questionSum = await questions.length;
  res.send({questionSum: questionSum, question : questions})
})


router.get('/hashnum/:target', function(req, res){
  const target=req.params.target;
  // const query=new RegExp(req.body.target,'i');
  var a;
  var uniquearr;
  async.waterfall([
    function(callback){
      Question.find({hashtags:target},'_id',(err,lists)=>{
        if (err) {
          return res.status(500).send('Error occurs during serach question')
        } else {
          a=lists;
          callback(null);
        }
      });
    }],
    function(){
      res.send({"count":a.length});
    }
  )
})
module.exports = router;