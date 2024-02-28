const mongoose=require('mongoose');

const courseSchema=new mongoose.Schema({
    course:{
        type:String,
    },
    dept:[{
        deptname:{
            type:String,
        }
    },],
});



const Course=mongoose.model('Course',courseSchema);
module.exports=Course;