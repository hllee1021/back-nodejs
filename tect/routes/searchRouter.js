var express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const async = require( "async" );

const Question = require('../models/question');
const Answer = require('../models/answer');
const Comment = require('../models/comment');
const { json } = require('body-parser');

//검색
router.post('/search', function(req, res){
    const target=req.body.target;
    const query=new RegExp(req.body.target,'i');
    var a;
    var uniquearr;
    async.waterfall([
      function(callback){
        Question.find({$or:[{'questionBody.title':query},{'questionBody.content':query}]},'_id',(err,lists)=>{
          if (err) {
            return res.status(500).send('Error occurs during serach question')
          } else {
            a=lists;
            callback(null);
          }
        });
      },
      function(callback){
        Answer.find({'answerBody.content':query},{_id:0,'answerBody.postID':1},(err,lists)=>{
          if (err) {
            return res.status(500).send('Error occurs during serach question')
          } else {
            var result=[];
            for(var i=0;i<lists.length;i++){
              var cur={};
              cur['_id']=lists[i]['answerBody']['postID'];
              result.push(cur);
            }
            a=a.concat(result);
            // console.log(lists);
            callback(null);
          }
        });
      },
      function(callback){
        const set=new Set(a);
        uniquearr=[...set];
        callback(null);
      }],
      function(){
        if(uniquearr.length==0){
          return res.json([]);
        }
        Question.find({$or:uniquearr},(err,lists)=>{
          if (err) {
            return res.status(500).send('Error occurs during serach question')
          } else {
            res.json(lists);
          }
        })
      }
    )
  })

module.exports = router;