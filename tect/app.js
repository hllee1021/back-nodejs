// ENV
require('dotenv').config();

// DEPENDENCIES
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors')
const port = 1818;

const answerRouter = require('./routes/answerRouter')
const questionRouter = require('./routes/questionRouter')
const commentRouter = require('./routes/commentRouter')
const userRouter = require('./routes/userRouter')
const loginRouter = require('./routes/loginRouter')
const imageRouter=require('./routes/imageRouter')
const searchRouter=require('./routes/searchRouter')
const techTreeRouter =require('./routes/techTreeRouter')
const Admin = require('./firebase/index');
const likeRouter=require('./routes/likeRouter');

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;
// CONNECT TO MONGODB SERVER //process.env.MONGO_URI
mongoose.connect(`mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@subjects.3o4wh.mongodb.net/tect_develop_DB?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false})
  .then(() => console.log('mongodb 연결 완료'))
  .catch(e => console.error(e));
mongoose.set('useCreateIndex', true)

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


//CONFIGURE ROUTER
app.get('/', (req, res) => {
  res.end("TECT BACKEND")
})
app.use('/answer', answerRouter)
app.use('/question' , questionRouter)
app.use('/comment', commentRouter)
app.use('/user', userRouter)
app.use('/login', loginRouter)
app.use('/image', imageRouter)
app.use('/search',searchRouter)
app.use('/techTree', techTreeRouter)
app.use('/like',likeRouter)

app.listen(port, () => console.log(`Server listening on port ${port}`));