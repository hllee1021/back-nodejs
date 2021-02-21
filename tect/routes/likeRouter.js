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
const {VERIFY_USER, FIND_MONGO_USER_BY_UID} =require('../firebase/tokenAuth');


router.put('/question/like/:id',async(req,res)=>{
    const id=req.params.id;
    // const user = await User.findOne({_id:'601d1a703118730630b8d2de'}).exec();
    FIREBASE_USER= await VERIFY_USER(req,res)
    MONGO_USER = await FIND_MONGO_USER_BY_UID(FIREBASE_USER.uid)
    MONGO_UID = MONGO_USER[0]._id
    // const user = await User.findOne({_id:'601d1a703118730630b8d2de'}).exec();
    async.waterfall([
        function(callback){
            if(MONGO_USER.like.includes(id)==false){
                console.log("qwe")
                Question.findOneAndUpdate({_id:id},{$inc:{like:1}}).exec();
                User.findOneAndUpdate({_id:MONGO_UID},{like:id}).exec();
            }
            else{
                Question.findOneAndUpdate({_id:id},{$inc:{like:-1}}).exec();
                User.findOneAndUpdate({_id:MONGO_UID},{$pull:{like:id}}).exec();
            }
            callback(null);
        }],
        function(){
          res.send("done");
        }
      )
})
  

module.exports = router;