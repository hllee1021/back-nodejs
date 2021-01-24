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
        const sessionCookie = req.cookies.loginSession || 'eyJhbGciOiJSUzI1NiIsImtpZCI6InRCME0yQSJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS90ZWN0LWZvci1kZXZlbG9wbWVudCIsImF1ZCI6InRlY3QtZm9yLWRldmVsb3BtZW50IiwiYXV0aF90aW1lIjoxNjExNDAzOTU4LCJ1c2VyX2lkIjoiODYwMktBcTBON2RNVWNUUHdyTEs1WEFxaUFtMiIsInN1YiI6Ijg2MDJLQXEwTjdkTVVjVFB3ckxLNVhBcWlBbTIiLCJpYXQiOjE2MTE0MDM5NjAsImV4cCI6MTYxMTQwNzU2MCwiZW1haWwiOiJyaW5ncmluZ0BuYXZlci5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsicmluZ3JpbmdAbmF2ZXIuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.X44ET-iiSXuI1lKRB7wl_kHbZtTRCXipNoQLfWHXpAoYPfSjg4CcmVEP7Ml83PKyix2eYmOKYxOklpTBV7adGCPZQ0U7PfrlGKZNw4uYrqw2AtjvOSo3joY_Bq0aShvusS4KCOdHO1QBID6URuf5I21rz8rZ5WI7_bSw_zL1EaEZ92xpW-U1N_ThFhf_SQEivHV-dPOOre0e9Ph5bCu5M6tYjmUV2x3Lf3u9l0YQE5Mz3OZyKhPs_XO9xJOeEgKpfRDo6mAk1QwIgXkJ5y9fFyV0su0OWycr6oxsG08XUgp0iIUG-r-vfSxfnAKFkJpvspo0s_0zuwoWASjnP8Od2Q'
        decodedClaims = await VERIFY_SESSION(sessionCookie);
        console.log('firebase Login Data:',decodedClaims)
        return decodedClaims
    } catch (err) {
        console.log("CANNOT FIND SESSION COOKIE",err)
        // return (err)
    }
}
//2. Decoding Session
const VERIFY_SESSION = async (sessionCookie) =>{
    try {
        // console.log("sessionCookie :",sessionCookie)
        const decodedClaims = await Admin.verifySessionCookie(sessionCookie, true);    
        firebase_uid = decodedClaims.sub
        // console.log(decodedClaims)
        // console.log("firebase_uid :",firebase_uid)
        return decodedClaims

    } catch(err) {
        console.log("CANNOT VERIFY SESSION COOKIE",err);
        return null
    }
}

//3. Finding in Database
const CHECK_USER = async (req, res) =>{
    const decodedClaims = await CHECK_SESSION(req, res)
    // const uid = decodedClaims.uid
    const email = decodedClaims.email
    const user = await User.findOne({"email":email}) 
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
        // console.log(idToken)
        //production : front에서 온 CSRF tocken check 추가
        const expiresIn = 60*60*1000
        const sessionCookie = await Admin.createSessionCookie(idToken, {expiresIn})
        console.log(sessionCookie)
        const options = { maxAge: expiresIn, httpOnly: true, secure: false } //secure:true  > local에서 test위해서false
        await res.cookie('loginSession', sessionCookie, options);
        // console.log("MAKE SESSION SUCCESS : ", sessionCookie)
        return sessionCookie
 
    } catch (err) {
        console.log("maeksession 오류?",err)
        //res.status(401).send(err)
    }
}

module.exports = {CHECK_SESSION, CHECK_USER,VERIFY_SESSION ,MAKE_SESSION}

