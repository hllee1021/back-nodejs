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

const Admin = require('./firebase/index');
const cookieParser = require('cookie-parser');

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;

// CONNECT TO MONGODB SERVER //process.env.MONGO_URI
mongoose.connect('mongodb+srv://dlgudals:dlgudals123@subjects.3o4wh.mongodb.net/tect_db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => console.log('mongodb 연결 완료'))
  .catch(e => console.error(e));

//CORS ALLOW    나중에는 사용방법 바꿔야 할 듯
app.use(cors())
// Static File Service
app.use(express.static('public'));
// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Cookie-parser
app.use(cookieParser());




//HOME - firebase test
app.get('/', (req, res)=>{

  // const firebase_UID = "J2n4AMsW2TWk7VnK17JAcEXGaWr1"
  // Admin.getUser(firebase_UID)
  // .then((result)=>{
  //   res.json(result)
    
  // })
  // .catch((err)=>{
  //   console.log(err)
  // })


})

app.post('/',  (req, res)=>{
  var firebaseToken = req.body.firebaseToken;
  console.log(firebaseToken)
  Admin
  .verifyIdToken(firebaseToken)
  .then((decodedTocken) => {
    console.log(decodedTocken)
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.post('/sessionLogin', (req,res)=>{
  const idToken =req.body.firebaseToken;
  
  //front에서 온 CSRF tocken check
  const expiresIn = 60*60*24*5*1000
  Admin
  .createSessionCookie(idToken, {expiresIn})
  .then((sessionCookie)=>{
    console.log("sessionCookie : ", sessionCookie)
    const options = {maxAge : expiresIn, httpOnly:true }; //secure:ture   httsp 뜻하는 건가
    
    res.cookie('session', sessionCookie, options);
    res.end(JSON.stringify({status : "세션 생성 및 전송 성공"}))
    console.log(req.cookies)
  })
  .catch((err)=>{
    res.status(401).send(err)
  })
})


app.post('/profile', (req, res)=>{
  const sessionCookie = req.cookies.session || "";
  console.log(sessionCookie);
})

//CONFIGURE ROUTER
app.use('/subject', subjectRouter)
app.use('/answer', answerRouter)
app.use('/question' , questionRouter)
app.use('/comment', commentRouter)
app.use('/user', userRouter)




app.listen(port, () => console.log(`Server listening on port ${port}`));