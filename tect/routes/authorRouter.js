var express = require('express');
const router = require('express').Router();
const {Author} = require('../models/model');

router.get('/', (req, res)=>{
//   Author.find((err, lists)=>{
//     if (err) {
//       return res.status(500).send('Cannot Get Answer')
//     } else {
//       res.json(lists);
//     }
//   })
    Author.find().populate('books').exec((err, lists)=> {
        if (err) {
            return res.status(500).send("cannot get author")
        } else {
            res.json(lists);
        }
    })
})

router.post('/', (req, res)=> {
  const author= new Author();
  author.books = //book의 objectId를 프론트에서 가져와야된다.
  author.name = req.body.author
  //DB에 저장
  post.save((err)=>{
    if (err) {
      console.log(err, "data save error");
      res.json({result: 0});
      return
    } else {
      res.json({result:1});
    }
  })
})


module.exports = router;
