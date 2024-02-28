const mongoose=require('mongoose');
const Course = require('./course');
const {Schema}=mongoose;
const paperSchema=new Schema({
    papername:{
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
    paper:[{
        year:{
            type:String,
        },
        link:{
            type:String,
        },
        postBy:{
            type:String,
        },
        postDate:{
            type:Date,
        },
    }],
    

});

const Paper=mongoose.model('Paper',paperSchema);

module.exports=Paper;
