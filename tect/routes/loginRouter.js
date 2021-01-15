const express = require('express');
const app = express();
const router = require('express').Router();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Admin = require('../firebase/index');
app.use(cookieParser())
const User = require('../models/user')


const CHECK_USER = require('../firebase/auth')
// const CHECK_SESSION =require('../firebase/auth')

//Route
//Profile
router.get('/profile', async (req,res)=>{
    const user =await CHECK_USER(req, res)
    user ? res.json(user) : res.json("NO USER") //redirect to create Account
})


router.get('/account', async (req,res)=>{
    const firebase_uid = await CHECK_USER(req, res)
    res.json(firebase_uid)
})


//Create USER DATA
router.post('/account', async (req, res) => {
    const firebase_uid = await CHECK_SESSION(req, res)
    
    const user = new User();
    const USER_ID = firebase_uid
    // post._id = mongoose.Types.ObjectId(USER_ID);
    user.userBody.authorID = USER_ID
    user.userBody.email = req.body.email;
    user.userBody.authorNickname = req.body.authorNickname;
    user.userBody.point = req.body.point;
    user.userBody.posts = req.body.posts


    //DB에 저장
    post.save((err) => {
        if (err) {
            console.log(err, "data save error");
            res.json({ result: 0 });
            return
        } else {
            res.json({ result: 1 });
        }
    })

})





//프론트에서 보내준 firebaseToken 이용, session cookie 생성
//Login
router.post('/sessionLogin', (req, res) => {
    try {
        const idToken = req.body.firebaseToken;
        //production : front에서 온 CSRF tocken check 추가
        const expiresIn = 60*60*1000
        Admin
            .createSessionCookie(idToken, { expiresIn })
            .then((sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true, secure: false }; //secure:true  > local에서 test위해서false
                res.cookie('loginSession', sessionCookie, options);
                res.end(JSON.stringify({ status: "세션 생성 및 전송 성공" }))
            })
            .catch((err) => {
                res.status(401).send(err)
            })
    } catch (err) {
        console.log(err)
    }
})

//Logout
router.get('/sessionLogout', (req, res) => {
    const sessionCookie = req.cookies.session || '';
    res.clearCookie('loginSession');
    Admin
        .verifySessionCookie(sessionCookie)
        .then((decodedClaims) => {
            return Admin.revokeRefreshTokens(decodedClaims.sub);
        })
        .then(() => {
            res.redirect('/');
        })
        .catch((error) => {
            res.redirect('/');
        });
});

module.exports = router;
