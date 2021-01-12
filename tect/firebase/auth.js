const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const Admin = require('./index');
app.use(cookieParser())
const User = require('../models/user')

//3. Finding in Database
const CHECK_USER = async (req, res) =>{
    const uid = await CHECK_SESSION(req, res)
    const user = await User.findOne({"userBody.authorID":uid}) 
    if (user) {
        return user
        //user.userBody.authorID = firebase_uid
    } else {
 
        return 
        //rediret to createUser
    }
}
//1. Checking Session exist
const CHECK_SESSION = async (req, res) => {
    try {
        const sessionCookie = req.cookies.loginSession || ''
        firebase_uid = await VERIFY_SESSION(sessionCookie);
 
        return firebase_uid
    } catch (err) {
        console.log("CANNOT FIND SESSION COOKIE",err)
        // return (err)
    }
}
//2. Decoding Session
const VERIFY_SESSION = async (sessionCookie) =>{
    try {
        const decodedClaims = await Admin.verifySessionCookie(sessionCookie, true);    
        firebase_uid = decodedClaims.sub;
        return firebase_uid

    } catch(err) {
        console.log("CANNOT VERIFY SESSION COOKIE",err);
        return("NONONO")
    }
}
module.exports = CHECK_USER
