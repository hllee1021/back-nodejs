const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define Schemes

const techTreeSchema = new Schema({
    title:{type:String, required:true},
    hashtags:[String],
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User'},

   
    
    nodeList:{
        type:String
    },
    linkList:{
        type:String
    }

}, {
    timestamps:true
});


// Create Model & Export
module.exports = mongoose.model('TechTree', techTreeSchema);