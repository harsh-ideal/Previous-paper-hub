const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    course_year_department:{
            type:String,
        },
    comment:{
        type:String,
    },    
});



const Comment=mongoose.model('Comment',commentSchema);
module.exports=Comment;