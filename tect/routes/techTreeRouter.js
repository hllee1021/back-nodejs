const router = require('express').Router();
const mongoose = require('mongoose');

const TechTree = require('../models/techTree');
const {VERIFY_USER, FIND_MONGO_USER_BY_UID} =require('../firebase/tokenAuth');

router.post('/', async(req, res)=>{
    FIREBASE_USER= await VERIFY_USER(req,res)
    MONGO_USER = await FIND_MONGO_USER_BY_UID(FIREBASE_USER.uid)
    MONGO_UID = MONGO_USER[0]._id
    TREE_ID = req.body._id

    const AUTHOR_ID = MONGO_UID || null

    const tree= new TechTree();
    tree._id = mongoose.Types.ObjectId(TREE_ID)
    tree.title = req.body.title
    tree.hashtags=req.body.hashtags
    tree.author=mongoose.Types.ObjectId(AUTHOR_ID)

    tree.nodeList=req.body.nodeList
    tree.linkList=req.body.linkList

    tree.save((err)=>{
        if(err){res.json("Tech tree 정보 저장 오류",err)}
        else { res.json({result:1})}
    })

})

router.get('/', async(req,res)=>{
    try{
        treeDataList=await TechTree.find().populate('author').exec()
        res.json(treeDataList) 
    } catch(err) {
        console.log(err)
    }

})

router.get('/:treeID', async(req, res)=>{
    try{
        treeData= await TechTree.findOne({_id:req.params.treeID}).populate('author').exec()
        res.json(treeData)
    } catch(err){
        console.log(err)
    }
    })

module.exports = router;
