// ENV
//require('dotenv').config();
// DEPENDENCIES
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors')
const port = 1818;

const subjectRouter = require('./routes/subjectRouter')
const answerRouter = require('./routes/answerRouter')
const questionRouter = require('./routes/questionRouter')
const commentRouter = require('./routes/commentRouter')
const userRouter = require('./routes/userRouter')
const loginRouter = require('./routes/loginRouter')
const imageRouter=require('./routes/imageRouter')

const Admin = require('./firebase/index');


// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;

// CONNECT TO MONGODB SERVER //process.env.MONGO_URI
mongoose.connect('mongodb+srv://dlgudals:dlgudals123@subjects.3o4wh.mongodb.net/mymy?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => console.log('mongodb 연결 완료'))
  .catch(e => console.error(e));

//CORS ALLOW    나중에는 사용방법 바꿔야 할 듯
//app.use(cors())
app.use(cors({
  origin: true,
  credentials: true
}));
// Static File Service
app.use(express.static('public'));
// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Cookie-parser
app.use(cookieParser());




//HOME - firebase test
// app.get('/sessionLogin', (req, res)=>{

//   const firebase_UID = "cvrUBQ319Mcz6oBKzgVurZxEYm13"
//   Admin.getUser(firebase_UID)
//   .then((result)=>{
//     res.json(result)
//     // res.end("Login Failure")
//   })
//   .catch((err)=>{
//     console.log(err)
//   })
// })

app.get('/', (req, res) => {
  res.end("HOME")
})


//CONFIGURE ROUTER
app.use('/subject', subjectRouter)
app.use('/answer', answerRouter)
app.use('/question' , questionRouter)
app.use('/comment', commentRouter)
app.use('/user', userRouter)
app.use('/login', loginRouter)



app.listen(port, () => console.log(`Server listening on port ${port}`));