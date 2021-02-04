var express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const async = require( "async" );

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath('./awsconfig.json');
const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'tectimage',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop());
        }
    }),
    limits: {
        fileSize: 1000 * 1000 * 10
    }
});


const Question = require('../models/question');
const Answer = require('../models/answer');
// const Comment = require('../models/comment');
const { json } = require('body-parser');

//글 작성 도중 이미지를 받으면, s3에 저장하고 url 리턴
router.post('/',upload.single('image'),(req, res) => {
    console.log(req.file);
    res.json(req.file.location);
})




module.exports = router;