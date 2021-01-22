var express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const async = require( "async" );
const multer=require('multer');
const upload=multer({dest:'uploads/'})

const Question = require('../models/question');
const Answer = require('../models/answer');
const Comment = require('../models/comment');
const { json } = require('body-parser');

//글 작성 도중 이미지를 받으면, s3에 저장하고 url 리턴
router.post('/', upload.single('image'),(req, res) => {
    console.log(req.file);
    
  
})




module.exports = router;