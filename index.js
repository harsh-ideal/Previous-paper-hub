if(process.env.NOD_ENV !="production"){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate');
const mongoose=require('mongoose');
const Vip=require('./models/vips.js');
const Course=require('./models/course.js');
const methodoverride=require('method-override');
const passport=require('passport');
const Localstrategy=require('passport-local');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const { ObjectId } = require('mongodb')
const flash=require('connect-flash');
const global=require("./routes/global.js");
const vip=require("./routes/vip.js");
const admin=require("./routes/admin.js");
const wrapasync=require("./utils/asyncWrap.js");
const expressError=require("./utils/ExpressError.js");
const Syllabus = require('./models/syllabus.js');
const dburl=process.env.ATLASDB_URL;
// const dburl="mongodb://127.0.0.1:27017/paper_hub?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3"
 
main().then(()=>console.log("mongo")).catch((err)=>console.log(err));


async function main(){
    await mongoose.connect(dburl);
}


const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("Error occured in Mongo Store",err);
})
const sessionoption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now +15*24*60*60*1000,
        maxAge:15*24*60*60*1000,
        httpOnly:true
    }
    }


    
app.use(session(sessionoption));
app.use(flash());


app.use((req,res,next)=>{
    res.locals.loggedIn=req.flash("loggedIn");
    res.locals.request=req.flash('request');
    res.locals.logout=req.flash('logout');
    res.locals.login_plzz=req.flash("login_plzz");
    res.locals.available=req.flash('available');
    res.locals.paperAdded=req.flash('paperAdded');
    res.locals.already=req.flash('already');
    res.locals.alreadyexist=req.flash('alreadyexist');
    res.locals.deletecontro=req.flash('deletecontro');
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(Vip.authenticate()));
passport.serializeUser(Vip.serializeUser());
passport.deserializeUser(Vip.deserializeUser());
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use((err,req,res,next)=>{
    let{status=500,message="Some Error Occured"}=err;
    res.status(status).send(message);
})

app.use((req,res,next)=>{
    res.locals.current=req.user;
    next();
});

app.use("/pph",global);
app.use("/vips",vip);
app.use("/admin",admin);

app.get("/",wrapasync(async (req,res)=>{
    let courses=await Course.find();
    res.render('home.ejs',{courses});
}));

app.get('/data/:id',wrapasync(async (req, res) => {
    let {id}=req.params;
    const course= await Course.findById(id);
    res.json({ data:course });
  }));

  app.get('/syllabuses/:id',wrapasync(async(req,res)=>{
    let {id}=req.params;
    const syllabus= await Syllabus.find({dept:id});
    console.log(syllabus);
    res.json({ data:syllabus });
  }));


// app.all("*",(req,res,next)=>{
//     next(new expressError(404,"Page Not Found"));
// })
app.listen(8080,()=>{
    console.log(`Server start responsing, done`);
});
