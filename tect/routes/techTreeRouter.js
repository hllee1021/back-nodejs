const router = require('express').Router();
const mongoose = require('mongoose');

const TechTree = require('../models/techTree');
const User= require('../models/user')
const {VERIFY_USER, FIND_MONGO_USER_BY_UID} =require('../firebase/tokenAuth');
const techTree = require('../models/techTree');

router.post('/', async (req, res) => {


    FIREBASE_USER = await VERIFY_USER(req, res)
    MONGO_USER = await FIND_MONGO_USER_BY_UID(FIREBASE_USER.uid)
    MONGO_UID = MONGO_USER[0]._id
    TREE_ID = req.body._id

    const AUTHOR_ID = MONGO_UID || null

    const tree = new TechTree();
    tree._id = mongoose.Types.ObjectId(TREE_ID)
    tree.title = req.body.title
    tree.hashtags = req.body.hashtags
    tree.author = mongoose.Types.ObjectId(AUTHOR_ID)

    tree.thumbnail = req.body.thumbnail
    tree.nodeList = req.body.nodeList
    tree.linkList = req.body.linkList

    //TechTree DB에 저장
    tree.save((err) => {
        if (err) { console.log("Tech tree 정보 저장 오류", err) }
        else { res.json({ result: 1 }) }
    })

    //USER DB에 저장
    const user = await User.findOne({ firebaseUid: FIREBASE_USER.uid }).exec()
    user.treeData.push(TREE_ID)
    user.save((err, result) => {
        if (err) { console.log(err) }
        else { console.log(result) }
    })


})

// router.get('/', async(req,res)=>{
//     try{
//         treeDataList=await TechTree.find().populate('author').exec()
//         res.json(treeDataList) 
//     } catch(err) {
//         console.log(err)
//     }

// })
router.get('/page/:page', async(req,res)=>{
    var page=req.params.page
    var offset=(page-1)*20
    var techtrees = await TechTree.aggregate([
        {$match:{_id: {$exists:true}}},
        {
            $lookup:{
                from:'users',
                localField:'_id',
                foreignField:'treeData',
                as:'author'
            }
        },
        {
            $project:{
                "author.displayName":1,
                "author.points":1,
                hashtags:1,
                nodeList:1,
                linkList:1,
                createdAt:1,
                updatedAt:1,
                title:1,
                thumbnail:1
            }
        }

    ])
    .sort({createdAt:-1})
    .skip(offset)
    .limit(20)
    .exec()

    var techTreeSum = await TechTree.find().countDocuments()
    res.send({techTreeSum:techTreeSum, techTree: techtrees})
})

router.get('/:treeID', async(req, res)=>{
    try{
        treeData= await TechTree.findOne({_id:req.params.treeID}).populate('author').exec()
        res.json(treeData)
    } catch(err){
        console.log(err)
    }
    })


router.put('/:treeID', async(req, res)=>{
    var objForUpdate={}
    if (req.body.title) objForUpdate.title = req.body.title
    if (req.body.hashtags) objForUpdate.hashtags = req.body.hashtags
    if (req.body.nodeList) objForUpdate.nodeList = req.body.nodeList
    if (req.body.linkList) objForUpdate.linkList = req.body.linkList
    if (req.body.thumbnail) objForUpdate.thumbnail = req.body.thumbnail
    objForUpdate={$set:objForUpdate}

    try{
        result=await TechTree.updateOne(
            {_id:req.params.treeID},
            objForUpdate
        ).exec()
        res.json(result.ok)
    } catch(err){
        res.json(err)
    }
})

router.delete('/:treeID',async(req,res)=>{
    try{
        result=await TechTree.deleteOne({_id:req.params.treeID}).exec()
        res.json(result.ok)
    } catch(err){
        res.json(err)
    }
})

module.exports = router;
