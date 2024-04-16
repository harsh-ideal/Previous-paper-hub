const mongoose=require("mongoose");
const {Schema}=mongoose;
const passlocalmongo=require('passport-local-mongoose');
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
    post:{
        type:String
    }
});
vipSchema.plugin(passlocalmongo);
const Vip=mongoose.model('Vip',vipSchema);

module.exports=Vip;