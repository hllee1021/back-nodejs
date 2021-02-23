const express = require('express');
const app = express();

//firebase admin.auth()
const Admin = require('./index');
//MongoDB User Model
const User = require('../models/user')


//Make MongoDB User Data with firebaseToken
const MAKE_MONGO_USER = async (req, res) =>{
    try {
        //front에서 로그인 및 회원가입 , 토큰 전달
        frontToken = req.body.firebaseToken
        firebaseUser = await Admin.verifyIdToken(frontToken)
        
        // //firebase user displayname 같이 주면 변경 후에 mongoDB에 저장
        firebaseUser = await UPDATE_FIREBASE_USER(req,res, firebaseUser.uid)
        console.log(firebaseUser)
        //mongoDB에 user 정보 저장
        mongoUser = await SAVE_MONGO_USER(req, res, firebaseUser)

        return mongoUser
    }catch(err){
        console.log("MAKE_USER 에러 발생 : ",err)
        return err
    }
}

const SAVE_MONGO_USER = async (req, res, firebaseUser) =>{
    const user = new User();
    user.email = firebaseUser.email;
    user.firebaseUid = firebaseUser.uid;
    user.displayName = req.body.displayName //이것 시간차이가 있으니 프론트에서 보내는 값으로 저장.
    user.introduce = req.body.introduce
    user.save((err)=>{
        if (err) {
            console.log("MAKE_USER, MongoDB save error", err)
        } else {
            console.log("MAKE_USER, MongoDB save 성공")
            return user
        }
    })
}

const UPDATE_FIREBASE_USER = async (req,res, firebaseUid) =>{
    UserRecord = await Admin.updateUser(firebaseUid, {
        // displayName:req.body.displayName
        displayName:req.body.displayName
    })
    user = UserRecord.toJSON()
    return user
}

const FIND_MONGO_USER = async(displayName) =>{
    //aggregate project 이용해서 uid 제외하고 보여주기?

    mongoUser = await User.find({displayName:displayName}).exec()
    console.log(mongoUser)
    return mongoUser
}


const VERIFY_USER = async(req, res)=>{
    try {
        //front에서 로그인 및 회원가입 , 토큰 전달
        frontToken = req.body.firebaseToken
        firebaseUser = await Admin.verifyIdToken(frontToken)
        console.log("여기" ,firebaseUser)
        return firebaseUser
    } catch(err){
        console.log("VERIFY MONGO USER WITH FIREBASE TOKEN 실패 : ", err)
        return null
    }
}
const FIND_MONGO_USER_BY_UID = async(frontFirebaseUid) =>{
    //aggregate project 이용해서 uid 제외하고 보여주기?
    
    mongoUser = await User.find({firebaseUid:frontFirebaseUid}).exec();
    console.log(mongoUser);
    console.log(mongoUser[0]._id)
    return mongoUser
}


module.exports = {MAKE_MONGO_USER, FIND_MONGO_USER, VERIFY_USER,FIND_MONGO_USER_BY_UID}

