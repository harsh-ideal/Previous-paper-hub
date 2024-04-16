const mongoose=require("mongoose");
const {Schema}=mongoose;

const vipRSchema=new Schema({
    name:{
        type:String
    },
    course:{
        type:Schema.Types.ObjectId,
        ref:"Course",
    },
    newcourse:{
        type:String,
    },
    department:{
        type:Schema.Types.ObjectId,
        ref:"Course.department"
    },
    newdept:{
        type:String,
    },
    num:{
        type:String,
    },
    username:{
        type:String,
    },
    post:{
        type:String
    },
    pass:{
        type:String,
    }
});


const Vip_Request=mongoose.model('Vip_Request',vipRSchema);

module.exports=Vip_Request;