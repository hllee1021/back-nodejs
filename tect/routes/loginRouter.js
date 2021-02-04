const express = require('express');
const app = express();
const router = require('express').Router();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Admin = require('../firebase/index');
app.use(cookieParser())


const User = require('../models/user')
const {MAKE_MONGO_USER, FIND_MONGO_USER_BY_UID} =require('../firebase/tokenAuth')


//Create USER DATA
router.post('/account', async (req, res) => {
    mongoUser = await MAKE_MONGO_USER(req, res)
    console.log(mongoUser)
    res.json(mongoUser)
})


router.get('/profile/:firebaseUid', async(req, res)=>{
    mongoUser = await FIND_MONGO_USER_BY_UID(req.params.firebaseUid)
    console.log(mongoUser)
    res.json(mongoUser)
})

router.post('/forgot/:email', async(req, res)=>{
    //https://firebase.google.com/docs/auth/admin/email-action-links
    res.json("forgot")
})

module.exports = router;
