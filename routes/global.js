const {storage}=require('../cloudConfig.js');
const express=require("express");
const router=express.Router();
const passport=require('passport');
const Localstrategy=require('passport-local');
const Vip_Request=require('../models/viprequest');
const Vip=require('../models/vips.js');
const Paper = require('../models/papers.js');
const Course=require('../models/course.js');
const Comment=require('../models/comment.js');
const wrapasync=require("../utils/asyncWrap.js");
const {isLoggedin}=require('../middleware.js');
const multer=require("multer");
const Syllabus = require("../models/syllabus.js");
// const upload=multer({
//     storage:storage,
// limits:{fileSize:2*1024*1024}}); 

const upload=multer({storage});

passport.use(new Localstrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
            if (!user.validPassword(password)) { return done(null, false, { message: 'Incorrect password.' }); }
            return done(null, user);
        });
    }
));

// router.use((err, req, res, next) => {
//     if (err instanceof MulterError) {
//       if (err.code === 'File too large') {
//         return res.status(400).send('File size exceeds the limit (2MB).');
//       }
//       next(err.code);
//     }
//     next(err.code);
//   });


router.use((req,res,next)=>{
    res.locals.current=req.user;
    next();
});


router.get('/search/found',wrapasync(async (req,res)=>{
    let {paper}=req.query;
    // let papers=await Paper.find({course:course,dept:depts});
    let papers=await Paper.find({paper:paper});
    res.render('paper.ejs',{papers});
}));
router.get("/",wrapasync(async (req,res)=>{
    let courses=await Course.find();
    res.render('home.ejs',{courses});
}));
router.get('/vip-register',wrapasync(async (req,res)=>{
    let courses=await Course.find();
    res.render('registration.ejs',{courses});
}));

router.get('/vip-login',(req,res)=>{
    res.render('login.ejs',{message:""});
});

router.get('/contributerlist',isLoggedin,wrapasync(async (req,res)=>{
    let vips= await Vip.find();
    for(let vip of vips){
            let course=await Course.findById(vip.course);
            vip.coursename=course.course;
            for(let dep of course.dept){
                if(dep.id==vip.department){
                    vip.deptname=dep.deptname;
                    break;
                }
            }
    }
    res.render('Contributers.ejs',{vips});
}));

router.post('/search',wrapasync(async (req,res)=>{
    let {course,depts}=req.body;
    let papers=await Paper.find({course:course,dept:depts});
    course=await Course.findById(course);
    for(d of course.dept){
        if(d._id==depts){
            depts=d;
            break;
        }
    }
    res.render('search.ejs',{papers,course,depts});
}));
router.get('/search/paper',wrapasync( async (req,res)=>{
    let {paper}=req.query;
    if(paper==""){
        res.render('nullpaper.ejs');
    }
    console.log(req);
    let papers=await Paper.findById(paper);
    let finalpaper=papers.paper;
    let code=papers.code;
    let name=papers.papername;
    console.log(finalpaper);
    res.render('paper.ejs',{finalpaper,code,name});

}));

router.post("/vip-register",wrapasync(async (req,res)=>{
    let {vipreq}=req.body;
    let vip=await Vip.find({username:vipreq.email});
    console.log(vip);
    if(vip&&vip.length){
        req.flash('already', "This username/email is already exist");
        res.redirect('/pph/vip-register');
    }
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
        username:vipreq.email,
        post:vipreq.post,
        pass:vipreq.pass,
    });
    req.flash('request','Wait for your request accepted Or call admin(9696585355)')
    await newreq.save();
    res.redirect('/pph');
}));

router.route('/addpaper') 
.get(isLoggedin ,wrapasync(async (req,res)=>{
    let courses=await Course.find();
    res.render('addpaper.ejs',{courses});
}))
.post(isLoggedin, upload.single('paper_pdf')
     ,wrapasync(async (req,res)=>{
        let {code,paper,year,pdf,cours,newcourse,department,newdept}=req.body;
        const papers=await Paper.find({code:code});
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
    
    let url=req.file.path;
    let filename=req.file.filename;
    let name=req.user.name;
    let email=req.user.username;
    console.log(papers);
    if(papers.length){
        for(paper of papers){
            if(paper.year==year){
                req.flash('available',"This paper is already available, thanks You for contributing");
                res.redirect('/pph')
            }
        }
        const result = await Paper.updateOne({code:code}, 
            { $push: {
                 paper: {
                    year:year,
                    link:{url,filename},
                    postBy:{name,email},
                } } });
    }else{
    let newPaper=new Paper({
        code:code,
        papername:paper,
        dept:department,
        course:cours,
        paper:[
            {
                year:year,
                link:{url,filename},
                postBy:{name,email},
            }
        ],
    });

    await newPaper.save();
}
req.flash('paperAdded',`Thank You ${req.user.name} for contributing`);
    res.redirect('/pph');
}));




router.route('/addsyllabus') 
.post(isLoggedin, upload.single('syllabus_pdf')
     ,wrapasync(async (req,res)=>{
        let {code,subject,semester,cours,newcourse,department,newdept}=req.body;
        const currentDate = new Date(Date.now());
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
    let surl=req.file.path;
    let sfilename=req.file.filename;
    console.log(sfilename);
    console.log(surl);
    console.log(currentDate.getFullYear());
    const syllabus=await Syllabus.find({code:code});
    if(syllabus.length){
        const result = await Syllabus.updateOne({code:code}, 
            { $push: {
                 syllabus: {
                    year:currentDate.getFullYear(),
                    link:{surl,sfilename},
                    postBy:req.user.name,
                } } });
    }else{
    let newSyllabus=new Syllabus({
        code:code,
        subjectname:subject,
        dept:department,
        course:cours,
        semester:semester,
        syllabus:[
            {
                link:{surl,sfilename},
                postBy:req.user.name,
                year:currentDate.getFullYear(),
            }
        ],
    });

    await newSyllabus.save();
}
    res.redirect('/pph');
}));




router.post('/vip-login',
    passport.authenticate('local',{
        failureRedirect:"/pph/vip-login", 
        failureFlash: true,
        }),
    wrapasync(async (req,res)=>{
        req.flash("loggedIn", "You are Logged In");
    res.redirect('/pph');
}));


router.post('/comment',wrapasync(async (req,res)=>{
    let {name,course_year_department,comment}=req.body
    let newComment=new Comment({
        name:name,
        course_year_department:course_year_department,
        comment:comment,
    });
    await newComment.save();
    res.redirect("/pph");
}));



router.get('/reqlist',wrapasync(async (req,res)=>{
    let reqs= await Vip_Request.find();
    for(let req of reqs){
        if(req.course&&!req.department){
            let course=await Course.findById(req.course);
            req.coursename=course.course;
            req.deptname=req.newdept;
        }
        else if(req.course&&req.department){
            let course=await Course.findById(req.course);
            req.coursename=course.course;
            for(let dep of course.dept){
                if(dep.id==req.department){
                    console.log("aa gye");
                    req.deptname=dep.deptname;
                    console.log(req.deptname);
                    break;
                }
            }
        }
        else if(!req.course&&!req.department){
            req.coursename=req.newcourse;
            req.deptname=req.newdept;
        }
    }
    res.render('vips.ejs',{reqs});
}));

router.get('/syllabus',wrapasync(async(req,res)=>{
    let courses=await Course.find();
    console.log(courses);
    res.render('syllabus_search.ejs',{courses});
}));

router.post('/syllabus/search',wrapasync(async(req,res)=>{
    let {sy}=req.body;
    console.log(sy);
    let syllabus=await Syllabus.findById(sy);
    console.log(syllabus);
    let finalsyllabus=syllabus.syllabus;
    let code=syllabus.code;
    let name=syllabus.subjectname;
    console.log(finalsyllabus);
    res.render('syllabus.ejs',{finalsyllabus,code,name});
}));
router.get('/read-comment',wrapasync(async(req,res)=>{
    let comment=await Comment.find();
    res.render('comment.ejs',{comment});
}));

module.exports=router;