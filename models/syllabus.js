const mongoose=require('mongoose');
const Course = require('./course');
const {Schema}=mongoose;
const syllabusSchema=new Schema({
    code:{
        type:String,
    },
    subjectname:{
        type:String,
    },
    dept:{
        type:Schema.Types.ObjectId,
        ref:'Course.department',
    },
    course:{
        type:Schema.Types.ObjectId,
        ref:'Courses'
    },
    semester:{
        type:String,
    },
    syllabus:[{
        year:{
            type:String,
        },
        link:{
            surl:String,
            sfilename:String,
        },
        postBy:{
            name:String,
            email:String,
        }
    }],
    

});

const Syllabus=mongoose.model('Syllabus',syllabusSchema);

module.exports=Syllabus;
