const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const Vip_Request=require('./models/viprequest');
const Vip=require('./models/vips.js');
const Paper = require('./models/papers.js');
const Course=require('./models/course.js');
const methodoverride=require('method-override');

main().then(()=>console.log("mongo")).catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/previous");
}

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));



app.get('/home/search/found',async (req,res)=>{
    let {dept,paper}=req.body;
    let papers=await Paper.find({dept:dept,paper:paper});
    res.redirect('/home/search',{papers});
});
app.get("/home",async (req,res)=>{
    let courses=await Course.find();
    res.render('home.ejs',{courses});
});
app.get('/home/vip-register',async (req,res)=>{
    let courses=await Course.find();
    res.render('registration.ejs',{courses});
});
app.get('/data/:id',async (req, res) => {
    let {id}=req.params;
    const course= await Course.findById(id);
    res.json({ data:course });
  });
app.get('/home/vip-login',(req,res)=>{
    res.render('login.ejs');
});
app.get('/admin/reqlist',async (req,res)=>{
    let reqs= await Vip_Request.find();
    console.log(reqs);
    res.render('vips.ejs',{reqs});
});
app.get('/admin/addpaper',async (req,res)=>{
    let courses=await Course.find();
    res.render('addpaper.ejs',{courses});
});
app.post('/admin/addpaper',async (req,res)=>{
    let {paper,year,pdf,cours,newcourse,department,newdept}=req.body;
    if(newcourse){
        let newcourses=new Course({
            course:newcourse,
            dept:[{deptname:newdept}],
        });
        
        cours=newcourses._id;
        department=newcourses.dept[0]._id;
        await newcourses.save();
    }else if(newdept){
        let newdeppt={deptname:newdept};
        let target=await Course.findById(cours);
        target.dept.push(newdeppt);
        await target.save();
        department=target.dept[target.dept.length-1]._id;
    }
    
    let newPaper=new Paper({
        papername:paper,
        dept:department,
        course:cours,
        paper:[
            {
                year:year,
                link:pdf,
            }
        ],
    });
    await newPaper.save();
    res.redirect('/home');
});
app.post('/admin/req/:id/vip',async (req,res)=>{
    let {id}=req.params;
    let temp=await Vip_Request.findByIdAndDelete(id);
    if(temp.newcourse){
        let newcourses=new Course({
            course:temp.newcourse,
            dept:[{deptname:temp.newdept}],
        });
        temp.course=newcourses._id;
        temp.department=newcourses.dept[0]._id;
        await newcourses.save();
    }else if(temp.newdept){
        let newdeppt={deptname:temp.newdept};
        let target=await Course.findById(temp.course);
        target.dept.push(newdeppt);
        await target.save();
        temp.department=target.dept[target.dept.length-1]._id;
    }
    let newvip=new Vip({
        name:temp.name,
        course:temp.course,
        department:temp.department,
        num:temp.num,
        email:temp.email,
        post:temp.post
    });
    await newvip.save();
    res.redirect('/home');
});

app.get('/home/search',async (req,res)=>{
    let {course,dept}=req.body;
    console.log(course+'..' +dept);
    let papers=await Paper.find({course:course,dept:dept});
    res.render('search.ejs',{papers,course,dept});
});
app.get('home/search/paper', async (req,res)=>{
    let {paper}=req.body;
    let papers=await Paper.findById(paper);
    let finalpaper=papers.papers;
    req.render('search.ejs',{finalpaper});

});


app.delete('/admin/req/:id',async (req,res)=>{
    let {id}=req.params;
    await Vip_Request.findByIdAndDelete(id);
    res.redirect('/admin/reqlist');
});
app.post("/home/vip-register",async (req,res)=>{
    let {vipreq}=req.body;
    if(vipreq.course==='other'){
        delete(vipreq.course);
    }else if(vipreq.department==='other'){
        delete(vipreq.department);
    }
    let newreq=new Vip_Request({
        name:vipreq.name,
        course:vipreq.course,
        newcourse:vipreq.newcourse,
        department:vipreq.department,
        newdept:vipreq.newdept,
        num:vipreq.num,
        email:vipreq.email,
        post:vipreq.post,
    });
    await newreq.save();
    res.redirect('/home');
});
app.listen(8080,()=>{
    console.log(`Server start responsing, done`);
});
