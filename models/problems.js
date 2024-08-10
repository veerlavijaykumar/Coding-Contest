const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const problemSchema=new Schema({problem_no:{type:Number,required:true},problem_name:{type:String,required:true},problem_link:{type:String,required:true}},{timestamps:true});
const Problem=mongoose.model("Problem",problemSchema);
module.exports=Problem;