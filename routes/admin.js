const express=require("express");
const router=express.Router();
const Vip_Request=require('../models/viprequest');
const mongoose=require('mongoose');
const Vip=require('../models/vips.js');
const Course=require('../models/course.js');
const wrapasync=require("../utils/asyncWrap.js");
const passport=require('passport');
const Localstrategy=require('passport-local');
const Paper = require("../models/papers.js");
const Syllabus = require("../models/syllabus.js");
const Comment=require("../models/comment.js");
const { isLoggedin } = require("../middleware.js");
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
router.use((req,res,next)=>{
    res.locals.current=req.user;
    next();
});

router.post('/req/:id/vip',wrapasync(async (req,res)=>{
    let {id}=req.params;
    let temp=await Vip_Request.findByIdAndDelete(id);
    const vips=await Vip.find({username:temp.email});
    if(vips&& vips.length){
        req.flash('alreadyexist', "This username/email is already exist");
        res.redirect('/pph/reqlist');
    }
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
        username:temp.username,
        post:temp.post
    });
    const vip=await Vip.register(newvip,temp.pass);
    res.redirect('/pph');
}));


router.delete('/contributers/:id',wrapasync(async (req,res)=>{
    let {id}=req.params;
    await Vip.findByIdAndDelete(id);
    res.redirect('/pph/contributerlist');
}));

router.delete('/req/:id',wrapasync(async (req,res)=>{
    let {id}=req.params;
    await Vip_Request.findByIdAndDelete(id);
    res.redirect('/pph/reqlist');
}));


router.delete('/contribution-paper/:id/:code',isLoggedin,wrapasync(async(req,res)=>{
    let {id,code}=req.params;

    let result = await Paper.updateOne(
        { code: code},
        { $pull: { paper: { _id: id} } }
      );
      req.flash('deletecontro','Successfull deleted');
      res.redirect('/pph');
}));

router.delete('/contribution-syllabus/:id/:code',isLoggedin,wrapasync(async(req,res)=>{
    let {id,code}=req.params;

    let result = await Syllabus.updateOne(
        { code: code},
        { $pull: { syllabus: { _id: id} } }
      );
      req.flash('deletecontro','Successfull deleted');
      res.render('home.ejs')
}));

router.get('/contro',isLoggedin,wrapasync(async(req,res)=>{
    let id = req.query.id;
    console.log(id)
    let vip=await Vip.findById(id);
    console.log(vip);
    let email=vip.username;
    let paper=[];
    let papers=await Paper.find();
    console.log(papers);
    for(let ps of papers){
        for(p of ps.paper){
            if(p.postBy.email==email){
                console.log(email);
                p.code=ps.code;
                p.papername=ps.papername;
                paper.push(p);
            }
        }
    }

    let syllabus=[];
    let syllabuses=await Syllabus.find();
    for(let ses of syllabuses){
        for(s of ses.syllabus){
            if(s.postBy.email==email){
                s.code=ses.code;
                s.subjectname=ses.subjectname;
                syllabus.push(s);
            }
        }
    }
    res.render('contribution.ejs',{paper,syllabus});
}));

router.get('/comment/:id',wrapasync(async(req,res)=>{
    let {id}=req.params;
    await Comment.findByIdAndDelete(id);
    res.redirect('/pph');
}));

module.exports=router;