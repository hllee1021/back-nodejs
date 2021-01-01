var express = require('express');
const router = require('express').Router();
const {Book} = require('../models/model');

router.get('/', (req, res)=>{
//   Book.find((err, lists)=>{
//     if (err) {
//       return res.status(500).send('Cannot Get Answer')
//     } else {
//       res.json(lists);
//     }
//   })
    Book.find().populate('author').exec((err, lists) => {
        if (err) {
            return res.status(500).send("cannot get author")
        } else {
            res.json(lists);
        }
})

})

router.post('/', (req, res)=> {
  const book= new Book();
  book.author = //author의 objectId를 프론트에서 가져와야된다.
  book.content = req.body.content
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
