const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const Admin = require('./index');
app.use(cookieParser())
const User = require('../models/user')

//SESSION CHECK

//1. Checking Session exist
const CHECK_SESSION = async (req, res) => {
    try {
        const sessionCookie = req.cookies.loginSession || ''
        firebase_uid = await VERIFY_SESSION(sessionCookie);
        console.log('CHECK SESSION:',firebase_uid)
        return firebase_uid
    } catch (err) {
        console.log("CANNOT FIND SESSION COOKIE",err)
        // return (err)
    }
}
//2. Decoding Session
const VERIFY_SESSION = async (sessionCookie) =>{
    try {
        console.log("sessionCookie :",sessionCookie)
        const decodedClaims = await Admin.verifySessionCookie(sessionCookie, true);    
        firebase_uid = decodedClaims.sub
        console.log("firebase_uid :",firebase_uid)
        return firebase_uid

    } catch(err) {
        console.log("CANNOT VERIFY SESSION COOKIE",err);
        return null
    }
}

//3. Finding in Database
const CHECK_USER = async (req, res) =>{
    const uid = await CHECK_SESSION(req, res)
    const user = await User.findOne({"userBody.authorID":uid}) 
    if (user) {
        console.log("CHECK USER")
        return user
        //user.userBody.authorID = firebase_uid
    } else {
        console.log("CHECK USER 에러")
        return null 
        //rediret to createUser
    }
}

//SESSION LOGIN
const MAKE_SESSION = async (req, res) =>{
    try {
        const idToken = req.body.firebaseToken;
        //production : front에서 온 CSRF tocken check 추가
        const expiresIn = 60*60*1000
        const sessionCookie = await Admin.createSessionCookie(idToken, {expiresIn})

        const options = { maxAge: expiresIn, httpOnly: true, secure: false } //secure:true  > local에서 test위해서false
        await res.cookie('loginSession', sessionCookie, options);
        // console.log("MAKE SESSION SUCCESS : ", sessionCookie)
        return sessionCookie
 
    } catch (err) {
        console.log(err)
        //res.status(401).send(err)
    }
}

module.exports = {CHECK_SESSION, CHECK_USER,VERIFY_SESSION ,MAKE_SESSION}

