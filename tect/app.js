// ENV
//require('dotenv').config();
// DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const subjectRouter = require('./routes/subjectRouter')
const answerRouter = require('./routes/answerRouter')
const questionRouter = require('./routes/questionRouter')
const commentRouter = require('./routes/commentRouter')
const userRouter = require('./routes/userRouter')
const cors = require('cors')
const app = express();
const port = 1818;

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;

// CONNECT TO MONGODB SERVER //process.env.MONGO_URI
mongoose.connect('mongodb+srv://dlgudals:dlgudals123@subjects.3o4wh.mongodb.net/tect_db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => console.log('mongodb 연결 완료'))
  .catch(e => console.error(e));


//DEFINE MODEL
// const subject = require('./models/subject');
// const answer = require('./models/answer');
// const question = require('./models/question')
// const comment =require('./models/comment')
// const user =require('./models/user')

//CORS ALLOW    나중에는 사용방법 바꿔야 할 듯
// app.use(cors())
// Static File Service
app.use(express.static('public'));
// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//CONFIGURE ROUTER
app.use('/subject', subjectRouter)
app.use('/answer', answerRouter)
app.use('/question' , questionRouter)
app.use('/comment', commentRouter)
app.use('/user', userRouter)

//////////////////////////////////밑으로는 test용 코드들//////////////////////////////
//////////////////////////////////book&author////////////////////////////////////////


const { Author } = require('./models/testModel');
const { Book } = require('./models/testModel');
const AUTHOR_OBJECTID = new mongoose.Types.ObjectId;
const BOOK_OBJECTID = new mongoose.Types.ObjectId;

app.get('/author', (req, res) => {
  Author.find().populate('books').exec((err, lists) => {
    if (err) {
      return res.status(500).send("cannot get author")
    } else {
      res.json(lists);
    }
  })
})
app.post('/author', (req, res) => {
  const author = new Author();
  // author._id = AUTHOR_OBJECTID
  author.name = req.body.name
  author.age = req.body.age

  //DB에 저장
  author.save((err) => {
    if (err) {
      console.log(err, "data save error");
      res.json({ result: 0 });
      return
    } else {
      res.json({result:1});
      // const book1 = new Book({
      //   title: req.body.title,
      //   author: author._id
      // })
      // book1.save((err) => {
      //   if (err) {
      //     res.json({ result: 00 });
      //   } else {
      //     res.json({ result: 11 })
      //   }
      // })
    };
  })
})

app.get('/book', (req, res) => {
  Book.find().populate('author').exec((err, lists) => {
    if (err) {
      return res.status(500).send("cannot get author")
    } else {
      res.json(lists);
    }
  })
});
app.post('/book', (req, res)=> {
  const book= new Book();
  book._id = BOOK_OBJECTID
  book.title = req.body.title
  book.book_id =req.body.book_id
  //DB에 저장
  book.save((err)=>{
    if (err) {
      console.log(err, "data save error");
      res.json({result: 0});
      return
    } else {
      const author1 = new Author({
        books : book._id,
        name : req.body.name,
        age : req.body.age
      })
      author1.save((err)=>{
        if (err) {
          res.json({result:00});
        }
        else {
          res.json({result:11})
        }
      })
    }
  })
})

app.put('/book/:book_id', (req,res)=>{
  Book.findOne({book_id:req.params.book_id}, (err, book)=>{
    if(err) {
      return res.status(500).json({ error: 'database update failure' });
    } if(!book) {
        return res.status(404).json({ error: 'data not found' });
    } else {
        if(req.body.book) {
          
        }
        book.save((err)=>{
            if(err) {
              res.status(500).json({error: 'failed to update'});
            } else {
              res.json({message: 'updated'});
            }
        })   
      }
  });
});



app.listen(port, () => console.log(`Server listening on port ${port}`));