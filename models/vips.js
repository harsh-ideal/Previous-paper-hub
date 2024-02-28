const mongoose=require("mongoose");
const {Schema}=mongoose;
const vipSchema=new mongoose.Schema({
    name:{
        type:String
    },
    course:{
        type:Schema.Types.ObjectId,
        ref:'Courses',
    },
    department:{
        type:Schema.Types.ObjectId,
        ref:'Courses.department',
    },
    num:{
        type:String
    },
    email:{
        type:String
    },
    post:{
        type:String
    }
});

const Vip=mongoose.model('Vip',vipSchema);

module.exports=Vip;